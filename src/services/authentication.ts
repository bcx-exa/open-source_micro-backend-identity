import { SignIn, SignUp } from "../types/authentication";
import { User } from "../models/user";
import { Client } from "../models/client";
import { validatePasswordHash, generatePasswordHash } from "../components/security/crypto";
import { Conflict, Unauthorized, NotVerified, InvalidFormat } from "../components/handlers/error-handling";
import { auroraConnectApi } from "../components/database/aurora";
import { validateUsername, validatePasswordStrength } from "../components/handlers/validation";
import { sendVerificationMessage } from "../components/messaging/account-verification";
import { findUserByUsername } from "../components/database/db-helpers";
import { v4 as uuidv4 } from 'uuid';

export class AuthenticationService {
  public async SignUp(body: SignUp): Promise<any> {
    // Check if username is of type email or of type phone_number
    const validPreferredUsername = validateUsername(body.preferred_username);
    const isValidEmail = validPreferredUsername.isValidEmail;
    const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;

    // Check if user exists
    const findUser = await findUserByUsername(body.preferred_username, validPreferredUsername);
    
    // If user exist throw conflict error
    if (findUser) {
      throw new Conflict("User Already Exists");
    }
    // Check password strength
    validatePasswordStrength(body.password);

    // Hash user password
    const genPassHash = generatePasswordHash(body.password);
    const salt = genPassHash.salt;
    const hash = genPassHash.genHash;
    const date = new Date();

    // Create user object
    const newUser: User = {
      user_id: uuidv4(),
      salt: salt,
      preferred_username: body.preferred_username,
      password: hash, // This is the hash
      given_name: body.given_name,
      family_name: body.family_name,
      picture: null,
      phone_number: isValidPhoneNumber ? body.preferred_username : null,
      address: null,
      locale: null,
      email: isValidEmail ? body.preferred_username : null,
      birthdate: null,
      email_verified: false,
      phone_number_verified: false,
      created_at: date,
      updated_at: date,
      signed_up_facebook: false,
      signed_up_google: false,
      signed_up_local: true,
      disabled: false,
      googleId: null,
      facebookId: null,
      verification_attempts: 1,
      account_locked: false,
      user_groups: null
    };

    // Save user to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    await repository.save(newUser);

    // Send verification message async
    sendVerificationMessage(newUser, isValidPhoneNumber, isValidEmail);

    // Return sucessful body
    return {
      statusCode: 200,
      body: "User signed up sucessfully, please verify your account!",
    };
  }

  // public async SignIn(response_type: string, scope:
  //                     string, client_id: string, client_secret: string, state: string, body: SignIn): Promise<any> {
    
    
  //   // Check for valid response type
  //   if (response_type !== 'implicit') {
  //     throw new InvalidFormat('Only implicit flow supported at this stage!');
  //   }

  //   // Check for valid scopes
  //   if (scope !== 'openid') {
  //     throw new InvalidFormat('Only supported scope for local signin is openid!');
  //   }

  //   // Connect to db to find authorized clients
  //   const connection = await auroraConnectApi();
  //   const repository = await connection.getRepository(Client);
  //   const findClient = await repository.findOne({ client_id: client_id });

  //   // Check if client exists
  //   if (!findClient) {
  //     throw new Unauthorized('Not a valid client id or client secret!');
  //   }
    
  //   // Validate client secret
  //   const validateClientSecret = validatePasswordHash(client_secret, findClient.client_secret, findClient.client_secret_salt);

  //   console.log(validateClientSecret);
  //   if (!validateClientSecret) {
  //     throw new Unauthorized('Not a valid client id or client secret!');
  //   }

  //   // Validate state
  //   if (findClient.state !== state) {
  //     throw new Unauthorized('State mismatch');
  //   }
  
  //   // Check if username is of type email or of type phone_number
  //   const validPreferredUsername = validateUsername(body.preferred_username);
  //   const isValidEmail = validPreferredUsername.isValidEmail;
  //   const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;

  //   // Connect to db to find user
  //   const findUser = await findUserByUsername(body.preferred_username, validPreferredUsername);

  //   // Can't find user throw unauthorized
  //   if (!findUser) {
  //     throw new Unauthorized("Invalid username or password");
  //   }

  //   // If account is locked throw
  //   if (findUser.account_locked) {
  //     let errorMessage = "Your account has been locked ";
  //     errorMessage += "as you have requested too many verification requests, please contact support";
  //     throw new Unauthorized(errorMessage);
  //   }

  //   // Valid email address but email not verified
  //   if (isValidEmail && !findUser.email_verified) {
  //     throw new NotVerified("User email has not been verified");
  //   }

  //   // Valid phone number but phone number not verified
  //   if (isValidPhoneNumber && !findUser.phone_number_verified) {
  //     throw new NotVerified("User phone number has not been verified");
  //   }

  //   // Validate password
  //   const validPassword = validatePasswordHash(body.password, findUser.password, findUser.salt);


  //   // If valid, issue JWT
  //   if (validPassword) {
  //     //const idToken = await generateIdToken(findUser);
  //     return {
  //       id_token: 'faje_token',
  //       token_type: "bearer"
  //     }
  //   }
  //   // Throw unauthorized
  //   else {
  //     throw new Unauthorized("Invalid username or password");
  //   }
  // }
}
