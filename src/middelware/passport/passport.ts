import { ExtractJwt } from "passport-jwt";
import passport from "passport";
import "reflect-metadata";
import { passportJWT } from './passport-jwt';
import { passportLocal } from "./passport-local";
import { User } from "../../models/user";
import { auroraConnectApi } from "../../components/database/connection";
import { passportOauthClient } from "./passport-http";
import { PassportGoogle } from "./passport-google";
import { PassportFacebook } from "./passport-facebook";

let initialized = false;

// This registers all the passport strategies
export async function registerStrategies(): Promise<any> {
  try {
    if (initialized) return;

    await passportLocal();
    await passportOauthClient();
    await passportJWT('jwt', ExtractJwt.fromAuthHeaderAsBearerToken());
    await passportJWT('jwt-query', ExtractJwt.fromUrlQueryParameter('token'));
    await passportJWT('jwt-body', ExtractJwt.fromBodyField('token'));
    await PassportGoogle();
    await PassportFacebook();

    passport.serializeUser(function (user: any, done) {
      done(null, user);
    });
  
    passport.deserializeUser(async function (user:any , done) {
      try {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(User);
        const findUser = await repository.findOne({ user_id: user.user_id });
        if (findUser) {
          return done(null, findUser);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    });


    initialized = true;
  
  } catch (e) {
    console.error(e);
  } 
}
  
// This is what TSOA uses for the @Security Decorator
export async function expressAuthentication(request: any, securityName: string, scopes?: string[]): Promise<any> {
  registerStrategies();

  let strategy; 

  // used in sign in
  if (securityName === 'local') {
    strategy = passport.authenticate(securityName, { session: true, successRedirect: '/', failureRedirect: 'auth/signin' });
  }
  
  // used in password reset, verify account & protecting of api's
  if (securityName === 'jwt' || securityName === 'jwt-query') {
    // Authentication
    strategy = passport.authenticate(securityName, {
      session: false,
    });
    // Authorization
    if (scopes) {
      //console.log(scopes);
    }
  }

  if (securityName === 'google') {
    strategy = passport.authenticate(securityName, { scope: scopes });
  }

  if (securityName == "google_callback") {
    strategy = passport.authenticate("google", { successRedirect: '/', failureRedirect: '/auth/login' });
  }

  if (securityName === 'facebook') {
    strategy = passport.authenticate(securityName, { scope: scopes });
  }

  if (securityName == "facebook_callback") {
    strategy = passport.authenticate("google", { successRedirect: '/', failureRedirect: '/auth/login' });
  }




  const authResult = await new Promise((resolve, reject) =>
    // using the strategy
    strategy(request, request.res, (err) => {
      if (err) {
        reject(err);
        throw new Error("Passport Auth Result Error" + err);
      } else {
        resolve(request.user);
      }
    })
  );
  return authResult;
}


