import { StrategyOptions, Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import passport from "passport";
import AWS from "aws-sdk";
import { UserProfile, UserIdentityJWT } from "../../models/identity";
import "reflect-metadata";
import { auroraConnectApi } from "../../helpers/aurora";
import googleoauth from "passport-google-oauth20";
const GoogleStrategy = googleoauth.Strategy;
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
  passport.use('jwt',
    new Strategy(optionHeader, async (jwtPayload: UserIdentityJWT, done: VerifiedCallback) => {
      try {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(UserProfile);
        const user = await repository.findOne({ identity_id: jwtPayload.sub });

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
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
    issuer: process.env.API_DOMAIN,
    secretOrKey: pubKey.Parameter.Value,
    algorithms: ["RS256"],
  };


  // Look in query string
  passport.use('jwt-query',
    new Strategy(optionQuery, async (jwtPayload: UserIdentityJWT, done: VerifiedCallback) => {
      try {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(UserProfile);
        const user = await repository.findOne({ identity_id: jwtPayload.sub });

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

  // Put your google oath-2 in here
  passport.use(
    new GoogleStrategy(
      {
        clientID: "27207807958-eh6ifp3lkr4kdmach3gr705f40qusamr.apps.googleusercontent.com",
        clientSecret: "2g7Ltiwu7Kmd-hEQT614oxkB",
        callbackURL: "http://localhost:7000/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        const ac = accessToken;
        const rf = refreshToken;
        console.log("profile.id", profile.id);
        try {
          const connection = await auroraConnectApi();
          const repository = await connection.getRepository(UserProfile);
          const user = await repository.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

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

  const authResult = await new Promise((resolve) =>
    strategy(request, request.res, (err, user) => {
      if (err) {
        throw new Error("Passport Auth Result Error" + err);
      } else {
        if (securityName == "google_callback") {
          request.redirect("/");
        }
        resolve(user);
      }
    })
  );
  return authResult;
}