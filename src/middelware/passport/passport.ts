import { StrategyOptions, Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import passport from "passport";
import AWS from "aws-sdk";
import { User } from "../../models/user";
import "reflect-metadata";
import { auroraConnectApi } from "../../components/database/aurora";
import googleoauth from "passport-google-oauth20";
import facebookoauth from "passport-facebook";
import { v4 as uuidv4 } from "uuid";
const GoogleStrategy = googleoauth.Strategy;
const FacebookStrategy = facebookoauth.Strategy;
//const GoogleStrategy = require("passport-google-oauth20").Strategy;

let initialized = false;

// This registers all the passport strategies
export async function registerStrategies(): Promise<any> {
  if (initialized) return;

  // JWT Strategies
  const ssm = new AWS.SSM({ region: process.env.REGION });
  const params = {
    Name: process.env.PUBLIC_KEY_NAME /* required */,
    WithDecryption: true,
  };

  const pubKey = await ssm.getParameter(params).promise();

  const optionHeader: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    issuer: process.env.API_DOMAIN,
    secretOrKey: pubKey.Parameter.Value,
    algorithms: ["RS256"],
  };
  
  // Look in auth header
  passport.use(
    "jwt",
    new Strategy(optionHeader, async (jwtPayload: any, done: VerifiedCallback) => {
      try {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(User);
        const user = await repository.findOne({ user_id: jwtPayload.sub });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );

  const optionQuery: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter("token"),
    issuer: process.env.API_DOMAIN,
    secretOrKey: pubKey.Parameter.Value,
    algorithms: ["RS256"],
  };

  // Look in query string
  passport.use(
    "jwt-query",
    new Strategy(optionQuery, async (jwtPayload: any, done: VerifiedCallback) => {
      try {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(User);
        const dbUser: User = await repository.findOne({ user_id: jwtPayload.sub });

        const user = { dbUser: dbUser, jwt: jwtPayload };

        if (dbUser) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        console.log(err);
        return done(err, false);
      }
    })
  );

  // Put your google oath-2 in here
  passport.use(
    new GoogleStrategy(
      {
        clientID: "27207807958-eh6ifp3lkr4kdmach3gr705f40qusamr.apps.googleusercontent.com",
        clientSecret: "2g7Ltiwu7Kmd-hEQT614oxkB",
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
            const userProfile: User = {
              user_id: uuidv4(),
              salt: "",
              preferred_username: profile._json.email,
              password: "No Password",
              given_name: profile._json.given_name,
              family_name: profile._json.family_name,
              picture: profile._json.picture,
              phone_number: null,
              address: null,
              locale: profile._json.locale,
              email: profile._json.email,
              birthdate: null,
              email_verified: profile._json.email_verified,
              phone_number_verified: false,
              created_at: date,
              updated_at: date,
              signed_up_facebook: false,
              signed_up_google: true,
              signed_up_local: false,
              disabled: false,
              googleId: profile.id,
              facebookId: null,
              account_locked: false,
              verification_attempts: 0,
              user_groups: null
            };
            await repository.save(userProfile);
            return done(null, userProfile);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // Put your facebook oath-2 in here
  passport.use(
    new FacebookStrategy(
      {
        clientID: "366695994722256",
        clientSecret: "3370da12dd1a1122597100699d16180d",
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
            const userProfile: User = {
              user_id: uuidv4(),
              salt: "",
              preferred_username: profile._json.email,
              password: "No Password",
              given_name: profile._json.first_name,
              family_name: profile._json.last_name,
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
              signed_up_facebook: false,
              signed_up_google: true,
              signed_up_local: false,
              disabled: false,
              googleId: null,
              facebookId: profile.id,
              account_locked: false,
              verification_attempts: 0,
              user_groups: null
            };
            await repository.save(userProfile);
            return done(null, userProfile);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser(function (user: any, done) {
    done(null, user.user_id);
  });

  passport.deserializeUser(async function (_id, done) {
    try {
      const connection = await auroraConnectApi();
      const repository = await connection.getRepository(User);
      const user = await repository.findOne({ user_id: _id });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  });

  initialized = true;
}

// This is what TSOA uses for the @Security Decorator
export async function expressAuthentication(request: any, securityName: string, scopes?: string[]): Promise<any> {
  registerStrategies();

  let strategy: any = passport.authenticate(securityName, {
    session: false,
  });

  if (securityName == "google") {
    strategy = passport.authenticate(securityName, { scope: scopes[0] });
  }
  if (securityName == "google_callback") {
    strategy = passport.authenticate("google");
  }

  if (scopes) {
    //console.log(scopes);
  }

  const authResult = await new Promise((resolve, reject) =>
    strategy(request, request.res, (err) => {
      if (err) {
        reject(err);
        throw new Error("Passport Auth Result Error" + err);
      } else {
        if (securityName == "google_callback") {
          request.redirect("/");
        }
        resolve(request.user);
      }
    })
  );
  return authResult;
}
