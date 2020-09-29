import { User } from "../../models/user";
import { signJWT, calculateExp } from "./crypto";
import { openid, profile } from "../../types/openid-scopes";
import { UserService } from "../../services/user";
import { v4 as uuidv4 } from "uuid";
import { token } from "@/middelware/passport/passport-oauth2orize";

export async function generateTokens(dbUser: User): Promise<any> {
  const tokenLink = uuidv4();

  // openid claims
  const openidClaims: openid = {
    sub: dbUser.user_id,
    iss: process.env.API_DOMAIN,
    aud: process.env.DOMAIN,
    iat: Math.floor(Date.now() / 1000),
    auth_time: Math.floor(Date.now() / 1000),
  };

  // profile claims
  const profileClaims: profile = {
    preferred_username: dbUser.preferred_username,
    given_name: dbUser.given_name,
    family_name: dbUser.family_name,
    address: dbUser.address,
    created_at: dbUser.created_at,
    locale: dbUser.locale,
    picture: dbUser.picture,
    birthdate: dbUser.birthdate,
    updated_at: dbUser.updated_at,
  };

  // id token structure
  const idToken = {
    token_link: tokenLink,
    token_use: "id_token",
    exp: calculateExp("10h", openidClaims.iat),
    ...openidClaims,
    ...profileClaims,
  };

  const accessToken = {
    token_link: tokenLink,
    token_use: "access_token",
    exp: calculateExp("2h", openidClaims.iat),
    ...openidClaims,
    scopes: new UserService().getUserScopes(dbUser.user_id),
  };

  const refreshToken = {
    token_link: tokenLink,
    token_use: "refresh_token",
    exp: calculateExp("30d", openidClaims.iat),
    ...openidClaims,
  };

  const signedIdToken = await signJWT(idToken);
  const signedAccessToken = await signJWT(accessToken);
  const signedRefreshToken = await signJWT(refreshToken);

  return {
    id_token: signedIdToken,
    access_token: signedAccessToken,
    refresh_token: signedRefreshToken,
    token_link: tokenLink,
  };
}
