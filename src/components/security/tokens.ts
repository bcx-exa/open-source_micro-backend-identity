import { User } from "../../models/user";
import { Client } from "../../models/client";
import { Oauth } from "../../models/oauth";
import { signJWT, calculateExp } from "./crypto";
import { openid, profile, email, phone } from "../../types/openid-scopes";
import { UserService } from "../../services/user";
import { v4 as uuidv4 } from "uuid";
import { InternalServerError, Unauthorized } from "../../types/response_types";
import { dbSaveOrUpdate } from "../database/db-helpers";
import jsonwebtoken from "jsonwebtoken";
import AWS from 'aws-sdk';

export async function generateCode(user: User, client: Client, scopes: any): Promise<any> {
  try {
    // openid claims
    const codeClaims: any = {
      sub: user.user_id,
      iss: process.env.API_DOMAIN,
      aud: process.env.DOMAIN,
      scope: scopes,
      iat: Math.floor(Date.now() / 1000),
      auth_time: Math.floor(Date.now() / 1000),
    };
    // id token structure
    const codeToken = {
      token_use: "code",
      code: uuidv4(),
      exp: calculateExp("2m", codeClaims.iat),
      ...codeClaims,
    };

    const signedCodeToken = await signJWT(codeToken);
    const date = new Date();

    const oauth_code: Oauth = {
      oauth_id: uuidv4(),
      user: user,
      client: client,
      token_type: "code",
      token: signedCodeToken,
      created_at: date,
      updated_at: date,
      disabled: false,
    };

    const saveCode = await dbSaveOrUpdate(Oauth, oauth_code);

    if (saveCode instanceof InternalServerError) {
      return saveCode;
    }

    return signedCodeToken;

  } catch (e) {
    return new InternalServerError('Unexpected error occured when trying to genarete oauth code', 500);
  }
}

export async function generateTokens(dbUser: User, decodedToken: any): Promise<any> {
  
  if (!decodedToken.scope) {
    throw new Unauthorized('No scopes specified in the grant type');
  }
  
  const scopes = decodedToken.scope;
  const findProfie = scopes.includes('profile');
  const findEmail = scopes.includes('email');
  const findPhone = scopes.includes('phone');

  if (!scopes) {
    throw new Unauthorized('No scopes specified in the grant type');
  }
  
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

  // email claims
  const emailClaims: email = {
    email: dbUser.email,
    email_verified: dbUser.email_verified
  };

  // phone claims
  const phoneClaims: phone = {
    phone_number: dbUser.phone_number,
    phone_number_verified: dbUser.phone_number_verified
  }

  const autoGeneratedScopes = await new UserService().getUserScopes(dbUser.user_id);

  const accessToken = {
    ...openidClaims,
    token_link: tokenLink,
    token_use: "access_token",
    exp: calculateExp("2h", openidClaims.iat),
    scope: autoGeneratedScopes,
  };

  const refreshToken = {
    ...openidClaims,
    token_link: tokenLink,
    token_use: "refresh_token",
    scope: scopes,
    exp: calculateExp("30d", openidClaims.iat),
  };

  if (findProfie) {
    Object.assign(accessToken, profileClaims);
  }

  if (findEmail) {
    Object.assign(accessToken, emailClaims);
  }

  if (findPhone) {
    Object.assign(accessToken, phoneClaims);
  }

  const signedAccessToken = await signJWT(accessToken);
  const signedRefreshToken = await signJWT(refreshToken);

  return {
    access_token: signedAccessToken,
    refresh_token: signedRefreshToken,
    token_link: tokenLink,
  };
}

export async function verifyAndDecodeToken(token: string): Promise<any> {
  try {
  
    // Get public key
    const ssm = new AWS.SSM({ region: process.env.REGION });
    const params = {
      Name: process.env.PUBLIC_KEY_NAME,
      WithDecryption: true,
    };

    // Decode code token
    let decodeToken;
    const pubKey = await ssm.getParameter(params).promise();

    try {
      decodeToken = jsonwebtoken.verify(token, pubKey.Parameter.Value, {
        algorithms: ["RS256"],
      });

      return decodeToken;
      
    } catch (e) {
      return new Unauthorized("Token not valid", 401, e);
    }
  } catch (e) {
    return new InternalServerError("Something went wrong with decoding or verifying token", 500, e);
  }
 
}
