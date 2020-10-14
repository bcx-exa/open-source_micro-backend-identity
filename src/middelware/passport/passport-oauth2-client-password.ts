import { Client } from "../../models/client";
import passport from "passport";
import { validatePasswordHash } from "../../components/security/crypto";
import { Strategy } from "passport-oauth2-client-password";
import { dbFindOneBy } from "../../components/database/db-helpers";
import { Unauthorized, NotFound, InternalServerError } from "../../types/response_types";
/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients. They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens. The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate. Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header). While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
export async function verifyClient(client_id, client_secret, done) {
  try {
    // Check client exist
    const client = await dbFindOneBy(Client, { where: { client_id: client_id, disabled: false } , relations: ['redirect_uris'] })
    
    // If not found or error, pass error to passport
    if (client instanceof NotFound || client instanceof InternalServerError) {
      const err = new Unauthorized('No matching client id/client secret combo');
      return done(err);
    }

    // Validate password
    const validPassword = validatePasswordHash(
      client_secret,
      client.client_secret,
      client.client_secret_salt
    );

    if (!validPassword) {
      const err = new Unauthorized('No matching client id/client secret combo');
      return done(err);
    }

    return done(null, client);
  } catch (err) {
    return done(err);
  }
}

export async function passportOauthClient() {
  passport.use("oauth2-client-password", new Strategy(verifyClient));
}
