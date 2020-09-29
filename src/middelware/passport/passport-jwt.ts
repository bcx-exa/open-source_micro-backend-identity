import { StrategyOptions, Strategy, VerifiedCallback } from "passport-jwt";
import passport from "passport";
import AWS from "aws-sdk";
import { User } from "../../models/user";
import "reflect-metadata";
import { auroraConnectApi } from "../../components/database/aurora";

export async function passportJWT(strategyName: string, jwtFromRequest: any):Promise<any> {
  // JWT Strategies
  const ssm = new AWS.SSM({ region: process.env.REGION });
  const params = {
    Name: process.env.PUBLIC_KEY_NAME,
    WithDecryption: true,
  };

  const pubKey = await ssm.getParameter(params).promise();

  const optionQuery: StrategyOptions = {
    jwtFromRequest: jwtFromRequest,
    issuer: process.env.API_DOMAIN,
    secretOrKey: pubKey.Parameter.Value,
    algorithms: ["RS256"],
  };

  // Look in query string
  passport.use(
    strategyName,
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
  )
}