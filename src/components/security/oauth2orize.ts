import { NotFound, Unauthorized, InternalServerError, NotVerified } from '../../types/response_types';
import { generateCode } from './tokens';
import { validateUsername } from '../handlers/validation';
import { validatePasswordHash } from './crypto';
import { dbFindOneBy, dbDelete } from '../database/db-helpers';
import { verifyAndDecodeToken, generateTokens } from './tokens';
import { Oauth } from '../../models/oauth';
import { User } from '../../models/user';
import { Client } from '../../models/client';

export class OauthHelpers {
  public async authorizationClientScopeCheck(client_id, redirect_uri, _scopes, done) {
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

    // return client and redirect_uri 
    return done(null, client, redirect_uri);
  }
  public async authorizationConcentCheck(client, user, done) {
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
      return done(null, true); // this should be set to true to bypass concent page

    } catch (e) {
      return done(e);
    }
  }
  public async grantCode(client, redirect_uri, user, ares, done): Promise<any> {
    try {
      // Check redirect uri is valid
      const uriMatch = client.redirect_uris
        .some(ruri => { return ruri.redirect_uri === redirect_uri });
      
      if (!uriMatch) {
        const err = new Unauthorized('Redirect URI Mismatch');
        return done(err);
      }

      // Generate code
      const code = await generateCode(user, client, ares.scope);

      // If error when generating code send error to passport
      if (code instanceof InternalServerError) {
        return done(code);
      }

      // Return code to passport
      return done(null, code);
    } catch (e) {     
      return done(e);
    }
  }
  public async exchangeCode(client, code, redirect_uri, done): Promise<any> {
    try {
      // Check client redirect uri match
      const uriMatch = client.redirect_uris
      .some(ruri => { return ruri.redirect_uri === redirect_uri });
    
      if (!uriMatch) {
        const err = new Unauthorized('Redirect URI Mismatch');
        return done(err);
      }
        
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

      // generate tokens
      const tokens = await generateTokens(dbCodeTokenRecord.user, client, codeToken.scope);
      
      // Issue tokens
      return done(null, tokens.access_token, tokens.refresh_token);

    } catch (e) {
      const err = new InternalServerError("Something went wrong in code exchange", 500, e);
      return done(err); 
    }
  }
  public async exchangePassword(client, username, password, scope, done): Promise<any> {
    try {
      // check client trusted
      if(!client.trusted) {
        const err = new Unauthorized('Client not trusted');
        return done(err);
      }
  
      // Check if username is of type email or of type phone_number
      const validPreferredUsername = validateUsername(username);
      const isValidEmail = validPreferredUsername.isValidEmail;
      const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;
  
      // Find Conditions
      const findCondition = isValidEmail
      ? { email: username, disabled: false }
      : { phone_number: username, disabled: false };
  
      // Check if user exists
      const dbUser = await dbFindOneBy(User, findCondition);
  
      // Can't find user throw unauthorized
      if (dbUser instanceof NotFound) {
        const err = new Unauthorized("Invalid username or password");
        return done(err);
      }
  
      // If account is locked throw
      if (dbUser.account_locked) {
        let errorMessage = "Your account has been locked ";
        errorMessage += "as you have requested too many verification requests, please contact support";
        const err = new Unauthorized(errorMessage);
        return done(err);
      }
  
      // Valid email address but email not verified
      if (isValidEmail && !dbUser.email_verified) {
        const err = new NotVerified("User email has not been verified");
        return done(err);
      }
  
      // Valid phone number but phone number not verified
      if (isValidPhoneNumber && !dbUser.phone_number_verified) {
        const err = new NotVerified("User phone number has not been verified");
        return done(err);
      }
  
      // Validate password
      const validPassword = validatePasswordHash(password, dbUser.password, dbUser.salt);
  
      if (!validPassword) {
        const err = new Unauthorized('Not a valid username or password');
        return done(err);
      }
      // generate tokens
      const tokens = await generateTokens(dbUser, client, scope);
    
      return done(null, tokens.access_token, tokens.refresh_token);
      
    } catch(e) {
      return done(e);
    }
  }
  public async exchangeRefreshToken(client, refreshToken, scope, done): Promise<any> {
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

      // generate tokens
      const tokens = await generateTokens(dbUser, client, scope);
    
      return done(null, tokens.access_token, tokens.refresh_token);

    } catch (e) {
      throw new InternalServerError("Refresh Token Error");
    }
  }
}