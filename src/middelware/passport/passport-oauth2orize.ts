/* eslint-disable */
import passport from "passport";
import oauth2orize from "oauth2orize";
import { Client } from "../../models/client";
import "reflect-metadata";
import { v4 as uuidv4 } from "uuid";
import { Oauth } from "../../models/oauth";
import { User } from "../../models/user";
import { generateTokens, generateCode, verifyAndDecodeToken } from "../../components/security/tokens";
import {
  Unauthorized,
  InternalServerError,
  NotFound,
} from "../../types/response_types";
import login from "connect-ensure-login";
import { dbFindOneBy, dbSaveOrUpdate, dbDelete } from "../../components/database/db-helpers";

// Create OAuth 2.0 server
const server = oauth2orize.createServer();

// This will add the client id to the cookie
server.serializeClient((client, done) => done(null, client));
// This will use the id from the cookie to get the client object from the DB
server.deserializeClient(async (client, done) => {
  try {
    // Find Client
    const dbClient = await dbFindOneBy(Client, { where: { client_id: client.client_id } , relations: ['redirect_uris'] });

    // If client not found or internal server error, give error to passport
    if (dbClient instanceof NotFound || dbClient instanceof InternalServerError) {
      return done(dbClient);
    }
    // Return client to passport
    return done(null, dbClient);
  } catch (err) {

    // If unexected error return to passport
    return done(err);
  }
});
// Issue Tokens
async function issueTokens(user_id: string, client: Client, done: any, decodedToken: any) {
  try {
    // Get User
    const user = await dbFindOneBy(User, { user_id: user_id });

    if (user instanceof NotFound) {
      return done(user);
    }

    // Generate tokens
    const tokens = await generateTokens(user, decodedToken);
    const date = new Date();

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
    oauth.push(accessToken, refreshToken);

    // Save tokens
    const saveTokens = await dbSaveOrUpdate(Oauth, oauth);

    if (saveTokens instanceof InternalServerError) {
      return done(saveTokens);
    }
    // Pass tokens to passport
    return done(null, tokens.access_token, tokens.refresh_token);
  } catch (e) {
    return done(e);
  }
}
// Register code grant method
server.grant(
  oauth2orize.grant.code(async (client, _redirect_uri, user, _ares, done) => {
    try {
      // Generate code
      const code = await generateCode(user, client, client.scopes);

      // If error when generating code send error to passport
      if (code instanceof InternalServerError) {
        return done(code);
      }

      // Return code to passport
      return done(null, code);
    } catch (e) {     
      return done(e);
    }
  })
);
// Register code exchange method
server.exchange(
  oauth2orize.exchange.code(async (client, code, _redirect_uri, done) => {
    try {
      // Check if token exists in DB
      const dbCodeTokenRecord = await dbFindOneBy(Oauth, { token: code, relations: ["client", "user"] });

      // If not return error to passport
      if (dbCodeTokenRecord instanceof NotFound || dbCodeTokenRecord instanceof InternalServerError) {
        return done(dbCodeTokenRecord);
      }

      // Decode token
      const codeToken = await verifyAndDecodeToken(code);

      // Return error to passport if verify & decoding failed
      if (codeToken instanceof Unauthorized || codeToken instanceof InternalServerError) {
        return done(codeToken);
      }

      // delete code from db, it's now been used
      const deleteCode = await dbDelete(Oauth, dbCodeTokenRecord);

      // If we couldn't delete code
      if (deleteCode instanceof InternalServerError) {
        return done(deleteCode);
      }
      // Issue tokens
      await issueTokens(dbCodeTokenRecord.user.user_id, client, done, codeToken);

    } catch (e) {
      const err = new InternalServerError("Something went wrong in code exchange", 500, e);
      return done(err); 
    }
  })
);
// issue new tokens and remove the old ones
server.exchange(
  oauth2orize.exchange.refreshToken(async (client, refreshToken, _scope, done) => {
    try {
      // Decode token
      const decodeRefreshToken = await verifyAndDecodeToken(refreshToken);

      // Return error to passport if verify & decoding failed
      if (decodeRefreshToken instanceof Unauthorized || decodeRefreshToken instanceof InternalServerError) {
        return done(decodeRefreshToken);
      }

      // Check if user exists
      const dbUser = await dbFindOneBy(User, { user_id: decodeRefreshToken.sub, disabled: false });

      if (dbUser instanceof NotFound || dbUser instanceof InternalServerError) {
        return done(dbUser);
      }

      // Check if you can find matching access token
      const dbAccessToken = await dbFindOneBy(Oauth,
        { token_link: decodeRefreshToken.token_link, token_type: "access_token" });
      
      // Pass error to passport
      if (dbAccessToken instanceof NotFound || dbAccessToken instanceof InternalServerError) {
        return done(dbAccessToken);
      }

      // Check refresh token valid
      const dbRefreshToken = await dbFindOneBy(Oauth,
        { token_link: decodeRefreshToken.token_link, token_type: "refresh_token" });

      // Pass error to passport
      if (dbRefreshToken instanceof NotFound || dbRefreshToken instanceof InternalServerError) {
        return done(dbAccessToken);
      }

      // Delete old tokens
      const deleteTokens = await dbDelete(Oauth, [dbAccessToken, dbRefreshToken]);

      // Pass error to passport
      if (deleteTokens instanceof InternalServerError) {
        return done(deleteTokens);
      }

      // Create new tokens ones
      await issueTokens(dbUser.user_id, client, done, decodeRefreshToken);

    } catch (e) {
      throw new InternalServerError("Refresh Token Error");
    }
  })
);
// The entry point for authorization api
export const authorization = [
  // Ensure user is logged in, if not redirect to login page
  login.ensureLoggedIn("/auth/login"),
  // Authorization logic
  server.authorization(
    async (client_id, redirect_uri, scopes, done) => {
      // Verify Client Exist
      const client = await dbFindOneBy(Client, { where: { client_id: client_id } , relations: ['redirect_uris'] });

      // If no client
      if (client instanceof NotFound || client instanceof InternalServerError) {
        return done(client);
      }

      // Check redirect uri is valid
      const uriMatch = client.redirect_uris
        .some(ruri => { return ruri.redirect_uri === redirect_uri });
      
      if (!uriMatch) {
        const err = new Unauthorized('Redirect URI Mismatch');
        return done(err);
      }

      // attach scopes to client object
      client.scopes = scopes;

      // return client and redirect_uri 
      return done(null, client, redirect_uri);
    },
    async (client, user, done) => {
      try {
        // Check for an access token
        const findAccessToken = await dbFindOneBy(Oauth,{
          client: client,
          user: user,
          token_type: "access_token",
        });

        // If error, pass it to passport
        if (findAccessToken instanceof InternalServerError) {
          return done(findAccessToken);
        }

        // If no access token, user haven't provided concent
        if (findAccessToken instanceof NotFound) {
          return done(null, false);
        } 

        // Auto approve, ie skip concent page because previously access token was issued
        return done(null, true);

      } catch (e) {
        return done(e);
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
  server.decision(function (req, done) {
    return done(null, { scope: req.oauth2.req.scope, state: req.oauth2.req.state })
  }),
];

export const token = [
  passport.authenticate(["oauth2-client-password-uri"], { session: false }),
  server.token(),
  server.errorHandler(),
];
