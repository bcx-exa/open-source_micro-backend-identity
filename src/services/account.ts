import { VerifyResend, PasswordResetRequest, PasswordReset } from "../types/account";
import { User } from "../models/user";
import { generatePasswordHash } from "../components/security/crypto";
import { NotFound, Unauthorized } from '../types/response_types';
import { validateUsername, validatePasswordStrength } from "../components/handlers/validation";
import { sendVerificationMessage } from "../components/messaging/account-verification";
import { sendPasswordResetRequest } from "../components/messaging/password-reset";
import express from 'express';
import { dbFindOneBy, dbSaveOrUpdate } from "../components/database/db-helpers";

export class AccountService {
  public async VerifyAccount(token: string, req: any): Promise<any> {
    // Double check passport-jwt
    if (!token) {
      throw new Error('Passport JWT missed a trick, Token was empty');
    }

    const response = (req).res as express.Response;

    // Extract infor from req object
    const dbUser: User = req.user.dbUser;
    const jwtEmailVerified: boolean = req.user.jwt.email_verified;
    const jwtPhoneVerified: boolean = req.user.jwt.phone_number_verified;

    //If both db and jwt is set to true throw conflict
    if (dbUser.email_verified && jwtEmailVerified) {
      return response.render("validated", {
        type: "orange",
        message: 'The user email address has already been verified, please login!'
      });
      // throw new Conflict('The user email address has already been verified, please login!');
    }

    //If both db and jwt is set to true throw conflict
    if (dbUser.phone_number_verified && jwtPhoneVerified) {
      return response.render("validated", {
        type: "orange",
        message: "The user phone number has already been verified, please login!"
      });
      // throw new Conflict('The user phone number has already been verified, please login!');
    }

    // Verify email address
    if (!dbUser.email_verified && jwtEmailVerified) {
      dbUser.email_verified = jwtEmailVerified
    }

    // Verify phone number
    if (!dbUser.phone_number_verified && jwtPhoneVerified) {
      dbUser.phone_number_verified = jwtPhoneVerified;
    }

    // Update user object
    await dbSaveOrUpdate(User, dbUser);

    return response.render("validated", {
      type: "green",
      message: "Account Verified"
    });
  }
  public async VerifyResend(body: VerifyResend): Promise<any> {
    // Check if username is of type email or of type phone_number
    const validatePreferredUsername = validateUsername(body.preferred_username);
    const isValidEmail = validatePreferredUsername.isValidEmail;
    const isValidPhoneNumber = validatePreferredUsername.isValidPhoneNumber;

    // Find Conditions
    const findCondition = isValidEmail
    ? { email: body.preferred_username, disabled: false }
    : { phone_number: body.preferred_username, disabled: false };

    // Check if user exists
    const findUser = await dbFindOneBy(User, findCondition);

    // If user doesn't exist throw error
    if (findUser instanceof NotFound) {
      throw findUser;
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
    await dbSaveOrUpdate(User, findUser);

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
  public async PasswordResetRequest(body: PasswordResetRequest, req: any): Promise<any> {
    const response = (req).res as express.Response;
    // Check if username is of type email or of type phone_number
    const validPreferredUsername = validateUsername(body.preferred_username);
    const isValidEmail = validPreferredUsername.isValidEmail;
    const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;

    // Check if user exist
    // Find Conditions
    const findCondition = isValidEmail
    ? { email: body.preferred_username, disabled: false }
    : { phone_number: body.preferred_username, disabled: false };

    // Check if user exists
    const findUser = await dbFindOneBy(User, findCondition);

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
    return response.render("forgot", {
      type: "green",
      message: "Password reset link has been sent"
    });
  }
  public async PasswordReset(token: string, body: PasswordReset, req: any): Promise<any> {
    // Double check passport-jwt
    if (!token) {
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
    validatePasswordStrength(body.password);

    // Hash user password
    const genPassHash = generatePasswordHash(body.password);
    const salt = genPassHash.salt;
    const hash = genPassHash.genHash;

    // Change user password
    dbUser.salt = salt;
    dbUser.password = hash;
    dbUser.updated_at = new Date();

    // Save user
    dbSaveOrUpdate(User, dbUser);

    // Return success
    return "Password has been reset, please try login!"
  }
}