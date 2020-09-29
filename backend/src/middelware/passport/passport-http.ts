import { Client } from "../../models/client";
import passport from "passport";
import { BasicStrategy } from "passport-http";
import { auroraConnectApi } from "../../components/database/aurora";
import { validatePasswordHash } from "../../components/security/crypto";

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
async function verifyClient(clientId, clientSecret, done) {
  try {
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Client);
    const client: Client = await repository.findOne({ client_id: clientId });

    if (!client) {
      return done(null, false);
    }

    // Validate password
    const validPassword = validatePasswordHash(
      clientSecret,
      client.client_secret,
      client.client_secret_salt
    );

    if (!validPassword) {
      return done(null, false);
    }

    return done(null, client);
  } catch (err) {
    return done(err);
  }
}

export async function passportHTTP() {
  passport.use("basic", new BasicStrategy(verifyClient));
}
