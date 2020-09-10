import { User } from '../../models/user';
import { signJWT, calculateExp } from './crypto';
import { openid, profile } from "../../types/openid-scopes";

export async function generateIdToken(dbUser: User): Promise<any> {
    // openid claims
    const openidClaims: openid = {
        sub: dbUser.user_id,
        iss: process.env.API_DOMAIN,   
        aud: process.env.DOMAIN,
        iat: Math.floor(Date.now() / 1000),
        auth_time: Math.floor(Date.now() / 1000)
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
        token_use: 'id_token',
        exp: calculateExp("10h", openidClaims.iat),
        ...openidClaims,
        ...profileClaims    
    }

   return await signJWT(idToken);
}

export function generateAccessToken(dbUser: User): any {
    // openid claims
    const openidClaims: openid = {
        sub: dbUser.user_id,
        iss: process.env.API_DOMAIN,   
        aud: process.env.DOMAIN,
        iat: (new Date().getTime()),
        auth_time: (new Date().getTime())
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
        ...openidClaims,
        ...profileClaims
    }

    // generate token
    return signJWT(idToken);
}