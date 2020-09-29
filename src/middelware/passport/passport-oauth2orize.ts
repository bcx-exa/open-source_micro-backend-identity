/* eslint-disable */
import passport from "passport";
import AWS from "aws-sdk";
import oauth2orize from "oauth2orize";
import oauth2orize_ext from "oauth2orize-openid";
import { Client } from "../../models/client";
import "reflect-metadata";
import { auroraConnectApi } from "../../components/database/aurora";
import { v4 as uuidv4 } from "uuid";
import { Oauth } from "../../models/oauth";
import { User } from "../../models/user";
import { generateTokens } from "../../components/security/tokens";
import {
  DbConnectionError,
  InternalServerError,
  NotFound,
  Unauthorized,
} from "../../components/handlers/error-handling";
import jsonwebtoken from "jsonwebtoken";
import login from "connect-ensure-login";
import { openid } from "../../types/openid-scopes";
import { signJWT, calculateExp } from "../../components/security/crypto";

// Create OAuth 2.0 server
const server = oauth2orize.createServer();

// This will add the client id to the cookie
server.serializeClient((client, done) => done(null, client));
// This will use the id from the cookie to get the client object from the DB
server.deserializeClient(async (client, done) => {
  try {
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Client);
    const findClient = await repository.findOne({ client_id: client.client_id });

    if (!findClient) {
      const err = new DbConnectionError("No client found");
      return done(err);
    }

    return done(null, findClient);
  } catch (err) {
    return done(err);
  }
});

// Issue Tokens
async function issueTokens(user_id, client_id, done) {
  try {
    const connection = await auroraConnectApi();
    const uRepository = await connection.getRepository(User);
    const cRepository = await connection.getRepository(Client);
    const oRepository = await connection.getRepository(Oauth);

    // Get Client
    const client = await cRepository.findOne({ client_id: client_id });

    if (!client) {
      const error = new NotFound("Client Not Found");
      return done(error);
    }

    // Get User
    const user = await uRepository.findOne({ user_id: user_id });

    if (!user) {
      const error = new NotFound("User Not Found");
      return done(error);
    }

    // Generate tokens
    const tokens = await generateTokens(user);
    const date = new Date();

    // Create id token
    const idToken: Oauth = {
      oauth_id: uuidv4(),
      token: tokens.id_token,
      token_link: tokens.token_link,
      token_type: "id_token",
      user: user,
      client: client,
      disabled: false,
      created_at: date,
      updated_at: date,
    };

    // Create access token
    const accessToken: Oauth = {
      oauth_id: uuidv4(),
      token: tokens.access_token,
      token_link: tokens.token_link,
      token_type: "access_token",
      user: user,
      client: client,
      disabled: false,
      created_at: date,
      updated_at: date,
    };

    // Create refresh token
    const refreshToken: Oauth = {
      oauth_id: uuidv4(),
      token: tokens.refresh_token,
      token_link: tokens.token_link,
      token_type: "refresh_token",
      user: user,
      client: client,
      disabled: false,
      created_at: date,
      updated_at: date,
    };

    const oauth = [];
    oauth.push(idToken, accessToken, refreshToken);

    // Save tokens
    const saveOauth = await oRepository.save(oauth);

    if (!saveOauth) {
      const error = new DbConnectionError("Couldnt save oath objects");
      return done(error);
    }
    // Just check if you can pass id token like this
    return done(null, tokens.access_token, tokens.refresh_token);
  } catch (e) {
    return done(e);
  }
}

// Register code grant method
server.grant(
  oauth2orize.grant.code(async (client, redirectUri, user, _ares, done) => {
    try {
      // openid claims
      const openidClaims: openid = {
        sub: user.user_id,
        iss: process.env.API_DOMAIN,
        aud: process.env.DOMAIN,
        iat: Math.floor(Date.now() / 1000),
        auth_time: Math.floor(Date.now() / 1000),
      };
      // id token structure
      const codeToken = {
        token_use: "code",
        code: uuidv4(),
        exp: calculateExp("2m", openidClaims.iat),
        ...openidClaims,
      };

      const signedCodeToken = await signJWT(codeToken);
      const date = new Date();
      const connection = await auroraConnectApi();
      const repository = await connection.getRepository(Oauth);

      const oath_code: Oauth = {
        oauth_id: uuidv4(),
        user: user,
        client: client,
        redirect_uri: redirectUri,
        token_type: "code",
        token: signedCodeToken,
        created_at: date,
        updated_at: date,
        disabled: false,
      };

      const saveCode = await repository.save(oath_code);

      if (!saveCode) {
        const error = new DbConnectionError("Not able to save auth code");
        return done(error);
      }

      return done(null, signedCodeToken);
    } catch (e) {
      return done(e);
    }
  })
);

// server.grant(
//   oauth2orize_ext.grant.codeIdTokenToken(
//     async function (client, code, done) {
//       try {
//         // Check if token is still valid
//         // passport.authenticate('jwt-query', {
//         //   session: false,
//         // });

//         const connection = await auroraConnectApi();
//         const repository = await connection.getRepository(Oauth);
//         const dbOauth = await repository.findOne({ token: code, relations: ["client", "user"] });

//         if (!dbOauth) {
//           const error = new NotFound("No auth code found");
//           return done(error);
//         }

//         if (client.client_id !== dbOauth.client.client_id) {
//           return done(null, false);
//         }

//         //  if (redirectUri !== dbOauth.redirect_uri) {
//         //     return done(null, false);
//         //  }

//         // delete code from db, it's now been used
//         await repository.delete(dbOauth);

//         await issueTokens(dbOauth.user.user_id, client.client_id, done);
//       } catch (e) {
//         throw new InternalServerError("Oauth2orize Code Exchange Error");
//       }
//     },
//     async function (client, redirectUri, user, done) {
//       try {
//         // openid claims
//         const openidClaims: openid = {
//           sub: user.user_id,
//           iss: process.env.API_DOMAIN,
//           aud: process.env.DOMAIN,
//           iat: Math.floor(Date.now() / 1000),
//           auth_time: Math.floor(Date.now() / 1000),
//         };
//         // id token structure
//         const codeToken = {
//           token_use: "code",
//           code: uuidv4(),
//           exp: calculateExp("2m", openidClaims.iat),
//           ...openidClaims,
//         };

//         const signedCodeToken = await signJWT(codeToken);
//         const date = new Date();
//         const connection = await auroraConnectApi();
//         const repository = await connection.getRepository(Oauth);

//         const oath_code: Oauth = {
//           oauth_id: uuidv4(),
//           user: user,
//           client: client,
//           redirect_uri: redirectUri,
//           token_type: "code",
//           token: signedCodeToken,
//           created_at: date,
//           updated_at: date,
//           disabled: false,
//         };

//         const saveCode = await repository.save(oath_code);

//         if (!saveCode) {
//           const error = new DbConnectionError("Not able to save auth code");
//           return done(error);
//         }

//         return done(null, signedCodeToken);
//       } catch (e) {
//         return done(e);
//       }
//     },
//     function (client, user, done) {
//       var id_token;
//       // Do your lookup/token generation.
//       // ... id_token =
//       done(null, id_token);
//     }
//   )
// );

// Register code exchange method
server.exchange(
  oauth2orize.exchange.code(async (client, code, _redirectUri, done) => {
    try {
      // Check if token is still valid
      // passport.authenticate('jwt-query', {
      //   session: false,
      // });

      const connection = await auroraConnectApi();
      const repository = await connection.getRepository(Oauth);
      const dbOauth = await repository.findOne({ token: code, relations: ["client", "user"] });

      if (!dbOauth) {
        const error = new NotFound("No auth code found");
        return done(error);
      }

      if (client.client_id !== dbOauth.client.client_id) {
        return done(null, false);
      }

      //  if (redirectUri !== dbOauth.redirect_uri) {
      //     return done(null, false);
      //  }

      // delete code from db, it's now been used
      await repository.delete(dbOauth);

      await issueTokens(dbOauth.user.user_id, client.client_id, done);
    } catch (e) {
      throw new InternalServerError("Oauth2orize Code Exchange Error");
    }
  })
);

// issue new tokens and remove the old ones
server.exchange(
  oauth2orize.exchange.refreshToken(async (client, refreshToken, _scope, done) => {
    try {
      // Get public key
      const ssm = new AWS.SSM({ region: process.env.REGION });
      const params = {
        Name: process.env.PUBLIC_KEY_NAME,
        WithDecryption: true,
      };

      // Decode refresht token
      let tokenDecoded;
      const pubKey = await ssm.getParameter(params).promise();
      try {
        tokenDecoded = jsonwebtoken.verify(refreshToken, pubKey.Parameter.Value, {
          algorithms: ["RS256"],
        });
      } catch (e) {
        return done(e);
      }

      // Make DB Connection
      const connection = await auroraConnectApi();
      const uRepository = await connection.getRepository(User);
      const oRepository = await connection.getRepository(Oauth);
      const cRepository = await connection.getRepository(Client);

      // Check user valid
      const dbUser = await uRepository.findOne({ user_id: tokenDecoded.sub, disabled: false });

      if (!dbUser) {
        const error = new NotFound("Cant find user in db");
        return done(error);
      }

      // Check client valid
      const dbClient = await cRepository.findOne({ client_id: client.client_id });

      if (!dbClient) {
        const error = new NotFound("Cant find client in db");
        return done(error);
      }

      // Check if you can find matching id token
      const dbIdToken = await oRepository.findOne({
        token_link: tokenDecoded.token_link,
        token_type: "id_token",
      });

      if (!dbIdToken) {
        const error = new NotFound("Cant find matching id token");
        return done(error);
      }

      // Check if you can find matching access token
      const dbAccessToken = await oRepository.findOne({
        token_link: tokenDecoded.token_link,
        token_type: "access_token",
      });

      if (!dbAccessToken) {
        const error = new NotFound("Cant find matching access token");
        return done(error);
      }

      // Check refresh token valid
      const dbRefreshToken = await oRepository.findOne({
        token: refreshToken,
        token_type: "refresh_token",
      });

      if (!dbRefreshToken) {
        const error = new NotFound("Cant find matching refresh token");
        return done(error);
      }

      // Delete old tokens
      await oRepository.delete([dbIdToken, dbAccessToken, dbRefreshToken]);

      // Create new tokens ones
      await issueTokens(dbUser.user_id, dbClient.client_id, done);
    } catch (e) {
      throw new InternalServerError("Refresh Token Error");
    }
  })
);

export const authorization = [
  login.ensureLoggedIn("/auth/login"),
  server.authorization(
    async (clientId, redirectUri, done) => {
      const connection = await auroraConnectApi();
      const cRepository = await connection.getRepository(Client);
      const client = await cRepository.findOne({ client_id: clientId });

      if (!client) {
        const err = new NotFound("No matching client_id/client_secret found");
        return done(err);
      }
      // if (client.redirect_uri !== redirectUri) {
      //   const err = new Unauthorized('Redirect URI mismatch');
      //   return done(err);
      // }

      return done(null, client, redirectUri);
    },
    async (client, user, done) => {
      try {
        const connection = await auroraConnectApi();
        const oRepository = await connection.getRepository(Oauth);
        const oauthRecord = await oRepository.findOne({
          client_id: client.client_id,
          user_id: user.user_id,
          token_type: "access_token",
        });

        if (oauthRecord) {
          return done(null, true);
        }

        return done(null, false);
      } catch (e) {
        return done(null, false);
      }
    }
  ),
  (request, response) => {
    response.render("dialog", {
      transactionId: request.oauth2.transactionID,
      user: request.user,
      client: request.oauth2.client,
    });
  },
];

export const decision = [
  login.ensureLoggedIn("/auth/login"),
  // says if user cancelled request
  server.decision(),
];

export const token = [
  passport.authenticate(["basic", "oauth2-client-password"], { session: false }),
  server.token(),
  server.errorHandler(),
];
