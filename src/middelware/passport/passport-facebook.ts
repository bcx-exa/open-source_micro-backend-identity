import passport from "passport";
import { Strategy } from "passport-facebook";
import { auroraConnectApi } from "../../components/database/connection";
import { User } from "../../models/user";
import { v4 as uuidv4 } from "uuid";

export async function PassportFacebook(): Promise<any> {
  passport.use('facebook',
    new Strategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://localhost:7000/auth/facebook/callback",
        profileFields: ["id", "first_name", "last_name", "email"],
      },
      async function (_accessToken, _refreshToken, profile, done) {
        try {
          const connection = await auroraConnectApi();
          const repository = await connection.getRepository(User);
          const user = await repository.findOne({ facebookId: profile.id });

          if (user) {
            user.given_name = profile._json.first_name;
            user.family_name = profile._json.last_name;
            user.updated_at = new Date();
            await repository.save(user);
            return done(null, user);
          } else {
            const date = new Date();
            const user: User = {
              user_id: uuidv4(),
              salt: uuidv4(),
              preferred_username: profile._json.email,
              password: uuidv4(),
              given_name: profile._json.first_name,
              family_name: profile._json.last_name,
              accepted_legal_version: '1.0.1',
              picture: null,
              phone_number: null,
              address: null,
              locale: null,
              email: profile._json.email,
              birthdate: null,
              email_verified: false,
              phone_number_verified: false,
              created_at: date,
              updated_at: date,
              signed_up_facebook: true,
              signed_up_google: false,
              signed_up_local: false,
              disabled: false,
              googleId: null,
              facebookId: profile.id,
              account_locked: false,
              verification_attempts: 1
            };
            await repository.save(user);
            return done(null, user);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  )
}