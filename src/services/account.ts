import { UserProfileUpdate, VerifyResend, PasswordResetRequest, PasswordReset } from "../types/account";
import { User } from "../models/user";
import { generatePasswordHash } from "../helpers/security/crypto";
import { Conflict, Unauthorized, InvalidFormat, PasswordPolicyException } from "../helpers/handlers/error-handling";
import { auroraConnectApi } from "../helpers/database/aurora";
import { validateUsername,  validatePasswordStrength } from "../helpers/handlers/validation";
import { sendVerificationMessage } from "../helpers/messaging/verification";
import { sendPasswordResetRequest } from "../helpers/messaging/password";

export class AccountService {
  public async VerifyAccount(token:string, req: any): Promise<any> {
    // Double check passport-jwt
    if(!token) {
      throw new Error('Passport JWT missed a trick, Token was empty');
    }
    // Extract infor from req object
    const dbUser: User = req.user.dbUser;   
    const jwtEmailVerified: boolean = req.user.jwt.email_verified;
    const jwtPhoneVerified: boolean = req.user.jwt.phone_number_verified;
    
    //If both db and jwt is set to true throw conflict
    if(dbUser.email_verified && jwtEmailVerified) {
      throw new Conflict('The user email address has already been verified, please login!');
    }
    
    //If both db and jwt is set to true throw conflict
    if(dbUser.phone_number_verified && jwtPhoneVerified) {
      throw new Conflict('The user phone number has already been verified, please login!');
    }
    
    // Verify email address
    if(!dbUser.email_verified && jwtEmailVerified) {
      dbUser.email_verified = jwtEmailVerified
    }

    // Verify phone number
    if(!dbUser.phone_number_verified && jwtPhoneVerified) {
      dbUser.phone_number_verified = jwtPhoneVerified;
    }

    // Update user object
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    await repository.save(dbUser);

    // Return success
    return {
      statusCode: 200,
      body: "Account Verified, please login!" 
    };
  }
  public async VerifyResend(body: VerifyResend): Promise<any> {
    // Check if username is of type email or of type phone_number
    const validPreferredUsername = validateUsername(body.preferred_username);
    const isValidEmail = validPreferredUsername.isValidEmail;
    const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;
    
    //if not valid types, throw InvalidFormat
    if (!isValidEmail && !isValidPhoneNumber) {
      throw new InvalidFormat("Not a valid phone number or email address");
    } 

    // Check if user exist
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    const find = isValidEmail ? { email: body.preferred_username } : { phone_number: body.preferred_username };
    const findUser = await repository.findOne(find);

    // Can't find user throw unauthorized
    if(!findUser) {
      throw new Unauthorized("Invalid account, please sign up");
    } 

    // Check if user is already verified
    const alreadyVerified = isValidEmail ? findUser.email_verified : findUser.phone_number_verified;
    if (alreadyVerified) {
      throw new Unauthorized("Account already verified, please log in");
    }

    // Add to verification attempts
    findUser.verification_attempts++;

    // Check if verification attempts 
    if (findUser.verification_attempts >= process.env.ALLOWED_VERIFICATION_ATTEMPTS) {
      findUser.account_locked = true;
    }

    // Save users
    repository.save(findUser);

    // If account locked, throw account locked
    if (findUser.account_locked) {
      throw new Unauthorized("Your account has been locked as you have requested too many verification requests, please contact support!")
    }

    //Send verification message 
    await sendVerificationMessage(findUser, isValidPhoneNumber, isValidEmail);

    // return ok
    return {
      statusCode: 200,
      body: 'Verification message resent!'
    }
   
  }
  public async ProfileUpdate(profile: UserProfileUpdate, req: any): Promise<any> {    
    // Check if username is of type email or of type phone_number
    const validPreferredUsername = validateUsername(profile.preferred_username);
    const isValidEmail = validPreferredUsername.isValidEmail;
    const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;
    
    //if not valid types, throw InvalidFormat
    if (!isValidEmail && !isValidPhoneNumber) {
      throw new InvalidFormat("Not a valid phone number or email address");
    }

    // Extract info from req object
    const dbUser: User = req.user.dbUser;  
    
    // Only update password if user choose to do so
    if (profile.password) {
      // Check password strength
      const pwdValidator = validatePasswordStrength();
      const checkPwdStrength = pwdValidator.validate(profile.password);
  
      // If pwd not strong enough throw error
      if(!checkPwdStrength) {
        throw new PasswordPolicyException('Password does not conform to the password policy. The policy enforces the following rules ' + pwdValidator.validate('joke', { list: true }))
      }
      
      // Hash user password
      const genPassHash = generatePasswordHash(profile.password);
      const salt = genPassHash.salt;
      const hash = genPassHash.genHash;  
      
      dbUser.salt = salt;
      dbUser.password = hash;
    } 
    
    // If email got updated, verify it
    if (dbUser.email !== profile.email) {
      dbUser.email = profile.email;
      sendVerificationMessage(dbUser, false, true);
    }

    // If phone got updated, verify it
    if (dbUser.phone_number !== profile.phone_number) {
      dbUser.phone_number = profile.phone_number;
      sendVerificationMessage(dbUser, true, false);
    }
    
    // update user properties
    dbUser.preferred_username = profile.preferred_username; 
    dbUser.email = profile.email;
    dbUser.phone_number = profile.phone_number;
    dbUser.given_name = profile.given_name;
    dbUser.family_name = profile.family_name;
    dbUser.address = profile.address;
    dbUser.birth_date = profile.birth_date;
    dbUser.locale = profile.locale;
    dbUser.picture = profile.picture;

    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    repository.save(dbUser);
    
    return {
      statusCode: 200,
      body: "Profile Updated!" 
    };
  }  
  public async PasswordResetRequest(body: PasswordResetRequest): Promise<any> {
    // Check if username is of type email or of type phone_number
    const validPreferredUsername = validateUsername(body.preferred_username);
    const isValidEmail = validPreferredUsername.isValidEmail;
    const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;
     
    //if not valid types, throw InvalidFormat
    if (!isValidEmail && !isValidPhoneNumber) {
      throw new InvalidFormat("Not a valid phone number or email address");
    }

    // Check if user exist
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    const find = isValidEmail ? { email: body.preferred_username } : { phone_number: body.preferred_username };
    const findUser = await repository.findOne(find);
    
    //If user doesn't exist throw error
    if (!findUser) {
      throw new Unauthorized("Invalid username or password");
    }

    // If account is locked throw error
    if (findUser.account_locked) {
      throw new Unauthorized("Your account has been locked as you have requested too many verification requests, please contact support!")
    }

    // Send password reset request link to user
    await sendPasswordResetRequest(findUser, isValidPhoneNumber, isValidEmail);

    // Return link has been sent
    return {
      statusCode: 200,
      body: "Password reset link has been sent"
    }
  }  
  public async PasswordReset(token: string, body: PasswordReset, req: any): Promise<any> {    
    // Double check passport-jwt
    if(!token) {
      throw new Error('Passport JWT missed a trick, Token was empty');
    }
    
    // Extract variables
    const dbUser: User = req.user.dbUser;   
    const passwordReset: boolean = req.user.jwt.password_reset;

    //Throw error if password_reset isn't true in the token
    if (!passwordReset) {
      throw new Unauthorized('Not a valid password reset token');
    }

    // Check password strength
    const pwdValidator = validatePasswordStrength();
    const checkPwdStrength = pwdValidator.validate(body.password);

    // If pwd not strong enough throw error
    if(!checkPwdStrength) {
      throw new PasswordPolicyException('Password does not conform to the password policy. The policy enforces the following rules ' + pwdValidator.validate('joke', { list: true }))
    }

    // Hash user password
    const genPassHash = generatePasswordHash(body.password);
    const salt = genPassHash.salt;
    const hash = genPassHash.genHash;  
     
    // Change user password
    dbUser.salt = salt;
    dbUser.password = hash;
    dbUser.updated_at = new Date();

    // Save user
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    repository.save(dbUser);

    // Return success
    return {
      statusCode: 200,
      body: "Password has been reset, please try login!"
    }
  }  

}