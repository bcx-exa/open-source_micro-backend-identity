import { ExtractJwt } from "passport-jwt";
import passport from "passport";
import "reflect-metadata";
import { passportJWT } from './passport-jwt';
import { passportLocal } from "./passport-local";
import { User } from "../../models/user";
import { auroraConnectApi } from "../../components/database/aurora";
import { passportHTTP } from "./passport-http";

let initialized = false;

// This registers all the passport strategies
export async function registerStrategies(): Promise<any> {
  try {
    if (initialized) return;

    await passportLocal();
    await passportHTTP();
    await passportJWT('jwt', ExtractJwt.fromAuthHeaderAsBearerToken());
    await passportJWT('jwt-query', ExtractJwt.fromUrlQueryParameter('token'));

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
    strategy = passport.authenticate(securityName, {
      session: false,
    });
  }


  if (scopes) {
    //console.log(scopes);
  }

  const authResult = await new Promise((resolve, reject) =>
    // using the strategy
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


