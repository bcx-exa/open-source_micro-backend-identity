/* eslint-disable */
import passport from "passport";
import oauth2orize from "oauth2orize";
import { OauthHelpers } from '../../components/security/oauth2orize';
import { Client } from "../../models/client";
import "reflect-metadata";
import { InternalServerError, NotFound } from "../../types/response_types";
import login from "connect-ensure-login";
import { dbFindOneBy } from "../../components/database/db-helpers";


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

// Register code grant method
server.grant(
  oauth2orize.grant.code(async (client, redirect_uri, user, ares, done) => {
    return await new OauthHelpers().grantCode(client, redirect_uri, user, ares, done);
  })
);
// Register code exchange method
server.exchange(
  oauth2orize.exchange.code(async (client, code, redirect_uri, done) => {
    return await new OauthHelpers().exchangeCode(client, code, redirect_uri, done);
  })
);

// Password Exchange 
server.exchange(oauth2orize.exchange.password(async (client, username, password, scope, done) => {
  return await new OauthHelpers().exchangePassword(client, username, password, scope, done);
}));


// issue new tokens and remove the old ones
server.exchange(
  oauth2orize.exchange.refreshToken(async (client, refreshToken, scope, done) => {
    return await new OauthHelpers().exchangeRefreshToken(client, refreshToken, scope, done);
  })
);
// The entry point for authorization api
export const authorization = [
  // Ensure user is logged in, if not redirect to login page
  login.ensureLoggedIn("/auth/login"),
  // Authorization logic
  server.authorization(
    async (client_id, redirect_uri, scopes, done) => {
      return await new OauthHelpers().authorizationClientScopeCheck(client_id, redirect_uri, scopes, done);
    },
    async (client, user, done) => {
      return await new OauthHelpers().authorizationConcentCheck(client, user, done);
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
  passport.authenticate(["oauth2-client-password"], { session: false }),
  server.token((req, done) => { 
    return done(null, { scope: req.oauth2.req.scope })
  }),
  server.errorHandler(),
];
