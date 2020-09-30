import passport from "passport";
import { Strategy } from "passport-google-oauth2";
import { auroraConnectApi } from "../../components/database/aurora";
import { User } from "../../models/user";
import { v4 as uuidv4 } from "uuid";
 
// Add phone nubmers once we are an approved app
export async function PassportGoogle():Promise<any> {
  passport.use('google',
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:7000/auth/google/callback",
    },
    async function (_accessToken, _refreshToken, profile, done) {
      try {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(User);
        const user = await repository.findOne({ googleId: profile.id });

        if (user) {
          user.given_name = profile._json.given_name;
          user.family_name = profile._json.family_name;
          user.picture = profile._json.picture;
          user.locale = profile._json.locale;
          user.email_verified = profile._json.email_verified;
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
            facebookId: null,
          };

          await repository.save(user);
          return done(null, user);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
}
