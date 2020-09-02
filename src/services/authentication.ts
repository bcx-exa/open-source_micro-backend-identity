import { SignIn, SignUp } from "../types/authentication";
import { User } from "../models/user";
import { profile } from "../types/scopes";
import { validatePasswordHash, generatePasswordHash,issueJWT } from "../helpers/security/crypto";
import { v4 as uuidv4 } from "uuid";
import { Conflict, Unauthorized, NotVerified, InvalidFormat, PasswordPolicyException } from "../helpers/handlers/error-handling";
import { auroraConnectApi } from "../helpers/database/aurora";
import { validateUsername,  validatePasswordStrength } from "../helpers/handlers/validation";
import { sendVerificationMessage } from "../helpers/messaging/verification";

export class AuthenticationService {
  public async SignUp(signUp: SignUp): Promise<any> {    
    // Check if username is of type email or of type phone_number
    const validPreferredUsername = validateUsername(signUp.preferred_username);
    const isValidEmail = validPreferredUsername.isValidEmail;
    const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;
    
    //if not valid types, throw InvalidFormat
    if (!isValidEmail && !isValidPhoneNumber) {
      throw new InvalidFormat("Not a valid phone number or email address");
    } 

    // Check if user exist
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    const find = isValidEmail ? { email: signUp.preferred_username } : { phone_number: signUp.preferred_username };
    const findUser = await repository.findOne(find);

    // If user exist throw conflict error
    if (findUser) {
      throw new Conflict("User Already Exists");
    } 

    // Check password strength
    const pwdValidator = validatePasswordStrength();
    const checkPwdStrength = pwdValidator.validate(signUp.password);

    // If pwd not strong enough throw 
    if(!checkPwdStrength) {
      throw new PasswordPolicyException('Password does not conform to the password policy. The policy enforces the following rules ' + pwdValidator.validate('joke', { list: true }))
    }

    // Hash user password
    const genPassHash = generatePasswordHash(signUp.password);
    const salt = genPassHash.salt;
    const hash = genPassHash.genHash;
    const date = new Date();

    // Create user object
    const newUser: User = {
      identity_id: uuidv4(),
      salt: salt,
      preferred_username: signUp.preferred_username,
      password: hash, // This is the hash
      given_name: signUp.given_name,
      family_name: signUp.family_name,
      picture: null,
      phone_number: isValidPhoneNumber ? signUp.preferred_username : null,
      address: null,
      locale: null,
      email: isValidEmail ? signUp.preferred_username : null,
      birth_date: null,
      email_verified: false,
      phone_number_verified: false,
      created_at: date,
      updated_at: date,
      signed_up_facebook: false,
      signed_up_google: false,
      signed_up_local: true,
      disabled: false,
      googleId: null,
      verification_attempts: 1,
      account_locked: false
    };

    // Save user to DB
    await repository.save(newUser);

    // Send verification message async
    sendVerificationMessage(newUser, isValidPhoneNumber, isValidEmail);

    // Return sucessful signUp 
    return {
      statusCode: 200, 
      body: "User signed up sucessfully, please verify your account!" 
    };
  }
  public async SignIn(signIn: SignIn): Promise<any> {
    // Check if username is of type email or of type phone_number
    const validPreferredUsername = validateUsername(signIn.preferred_username);
    const isValidEmail = validPreferredUsername.isValidEmail;
    const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;
    
    //if not valid types, throw InvalidFormat
    if (!isValidEmail && !isValidPhoneNumber) {
      throw new InvalidFormat("Not a valid phone number or email address");
    } 

    // Connect to db to find user
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    const findUser = await repository.findOne({ preferred_username: signIn.preferred_username });

    // Can't find user throw unauthorized
    if(!findUser) {
      throw new Unauthorized("Invalid username or password");
    } 

    // If account is locked throw
    if (findUser.account_locked) {
      throw new Unauthorized("Your account has been locked as you have requested too many verification requests, please contact support!")
    }

    // Valid email address but email not verified
    if(isValidEmail && !findUser.email_verified) {
      throw new NotVerified("User email has not been verified");
    }

    // Valid phone number but phone number not verified
    if(isValidPhoneNumber && !findUser.phone_number_verified) {
      throw new NotVerified("User phone number has not been verified");
    }

    // Validate password
    const validPassword = validatePasswordHash(signIn.password, findUser.password, findUser.salt);
    const dbUser: User = findUser as User;
    
    const profileClaims: profile = {
      preferred_username: dbUser.preferred_username,
      given_name: dbUser.given_name,
      family_name: dbUser.family_name,
      address: dbUser.address,
      created_at: dbUser.created_at,
      locale: dbUser.locale,
      picture: dbUser.picture,
      birth_date: dbUser.birth_date,
      updated_at: dbUser.updated_at
    }

    // If valid, issue JWT
    if (validPassword) {      
        return issueJWT(dbUser.identity_id, '7d', false, profileClaims );
    }
    // Throw unauthorized
    else {
      throw new Unauthorized("Invalid username or password");
    }
  }
}