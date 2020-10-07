import {  SignUp } from "../types/authentication";
import { User } from "../models/user";
import {  generatePasswordHash } from "../components/security/crypto";
import { Conflict, NotFound } from '../types/response_types';
import { validateUsername, validatePasswordStrength } from "../components/handlers/validation";
import { sendVerificationMessage } from "../components/messaging/account-verification";
import { dbFindOneBy, dbSaveOrUpdate} from "../components/database/db-helpers";
import { v4 as uuidv4 } from 'uuid';

export class AuthenticationService {
  public async SignUp(body: SignUp): Promise<any> {
    // Check if username is of type email or of type phone_number
    const validPreferredUsername = validateUsername(body.preferred_username);
    const isValidEmail = validPreferredUsername.isValidEmail;
    const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;

    // Find Conditions
    const findCondition = isValidEmail
    ? { email: body.preferred_username, disabled: false }
    : { phone_number: body.preferred_username, disabled: false };

    // Check if user exists
    const findUser = await dbFindOneBy(User, findCondition);
    
    // If user exist throw conflict error
    if (!(findUser instanceof NotFound)) {
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
      accepted_legal_version: body.accepted_legal_version,
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
    await dbSaveOrUpdate(User, newUser);

    // Send verification message async
    sendVerificationMessage(newUser, isValidPhoneNumber, isValidEmail);

    // Return sucessful body
    return "User signed up sucessfully, please verify your account!";
  }
}
