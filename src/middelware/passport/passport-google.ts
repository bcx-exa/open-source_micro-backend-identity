import passport from "passport";
import { Strategy } from "passport-google-oauth2";
import { User } from "../../models/user";
import { v4 as uuidv4 } from "uuid";
import { dbFindOneBy, dbSaveOrUpdate } from "../../components/database/db-helpers";
import { Client } from "../../models/client";
import { NotFound, InternalServerError, Unauthorized } from "../../types/response_types";

// Add phone nubmers once we are an approved app
export async function PassportGoogle(): Promise<any> {
  passport.use('google',
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:7000/auth/google/callback",
        passReqToCallback: true
      },
      async function (req, _accessToken, _refreshToken, profile, done) {
        try {

          console.log(req.query.state);
          const myState = JSON.parse(req.query.state);
          // Check client exist
          const client_id = myState.clientID;
          const client_secret = myState.clientSecret;

          if (!client_id || !client_secret) {
            const err = new Unauthorized('No client id or secret');
            return done(err);
          }

          const client = await dbFindOneBy(Client, { where: { client_id: client_id, disabled: false }, relations: ['redirect_uris'] })

          if (client instanceof NotFound || client instanceof InternalServerError) {
            const err = new Unauthorized('No matching client id/client secret combo');
            return done(err);
          }

          const redirect_uri = myState.redirect_uri;

          // Check client redirect uri match
          const uriMatch = client.redirect_uris
            .some(ruri => { return ruri.redirect_uri === redirect_uri });

          if (!uriMatch) {
            const err = new Unauthorized('Redirect URI Mismatch');
            return done(err);
          }

          // Check scope
          const scope = myState.scope;

          if (!scope) {
            const err = new Unauthorized('No scope specified in query string');
            return done(err);
          }

          const user = await dbFindOneBy(User, { email: profile._json.email });
          // If not found or error, pass error to passport

          if (user) {
            user.googleId = profile.id;
            user.given_name = profile._json.given_name;
            user.family_name = profile._json.family_name;
            user.picture = profile._json.picture;
            user.locale = profile._json.locale;
            user.email_verified = profile._json.email_verified;
            user.updated_at = new Date();

            await dbSaveOrUpdate(User, user);

            user.client = client;
            user.scope = scope;
            user.redirect_uri = redirect_uri;

            return done(null, user);

          } else {
            const date = new Date();
            const user: any = {
              user_id: uuidv4(),
              salt: uuidv4(),
              preferred_username: profile._json.email,
              password: uuidv4(),
              accepted_legal_version: '1.0.1',
              given_name: profile._json.given_name,
              family_name: profile._json.family_name,
              picture: profile._json.picture,
              phone_number: null,
              address: null,
              locale: profile._json.locale,
              email: profile._json.email,
              birthdate: profile._json.birthday,
              email_verified: profile._json.email_verified,
              phone_number_verified: false,
              created_at: date,
              updated_at: date,
              signed_up_facebook: false,
              signed_up_google: true,
              signed_up_local: false,
              disabled: false,
              verification_attempts: 1,
              account_locked: false,
              googleId: profile.id,
              facebookId: null
            };

            await dbSaveOrUpdate(User, user);

            user.client = client;
            user.scope = scope;
            user.redirect_uri = redirect_uri;

            return done(null, user);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
}
