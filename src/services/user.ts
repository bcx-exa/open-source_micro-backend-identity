import { UserRequest } from "../types/user";
import { User } from "../models/user";
import { generatePasswordHash } from "../components/security/crypto";
import { NotFound, Conflict } from "../components/handlers/error-handling";
import { auroraConnectApi } from "../components/database/aurora";
import { findUserByUsername, findBy, findAll } from "../components/database/db-helpers";
import { validateUsername, validatePasswordStrength } from "../components/handlers/validation";
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  // Users
  public async getUser(user_id: string): Promise<any> {
    // Connect to DB
    const findUser = await findBy("user_id", user_id, User);

    // If user doesnt exist, then throw error
    if (!findUser) {
      throw new NotFound("User not found");
    }

    // return user
    return findUser;
  }
  public async getUsers(): Promise<any> {
      // Connect to DB
    const findUsers = await findAll(User);
  
    // If users doesnt exist, then throw error
    if (!findUsers) {
      throw new NotFound("No users found, table empty");
    }

    // return user
    return findUsers;
  }
  public async createUser(body: UserRequest): Promise<any> {
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
      name: body.name,
      nickname: body.nickname,
      gender: body.gender,
      password: hash, // This is the hash
      given_name: body.given_name,
      family_name: body.family_name,
      picture: null,
      phone_number: isValidPhoneNumber ? body.preferred_username : null,
      address: null,
      locale: null,
      email: isValidEmail ? body.preferred_username : null,
      birthdate: null,
      email_verified: true,
      phone_number_verified: true,
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
    
    return newUser;
  }
  public async deleteUser(user_id: string): Promise<any> {
    // Connect to DB
    const findUser = await findBy("user_id", user_id, User);

    // If user doesnt exist, then throw error
    if (!findUser) {
      throw new NotFound("User not found");
    }
    findUser.disabled = true;
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    await repository.save(findUser);
    // return user
    return "User disabled sucessfully!";
  }
}
