import { UserRequest } from "../types/user";
import { User } from "../models/user";
import { UserGroup } from "../models/user-group";
import { ScopeGroup } from "../models/scope-group";
import { generatePasswordHash } from "../components/security/crypto";
import { NotFound, Conflict } from "../types/response_types";
import { auroraConnectApi } from "../components/database/connection";
import { dbFindOneBy, findUserByUsername } from "../components/database/db-helpers";
import { validateUsername, validatePasswordStrength } from "../components/handlers/validation";
import { sendVerificationMessage } from "../components/messaging/account-verification";
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  // Users
  public async getUser(user_id: string, detailed: boolean): Promise<any> {
    // Connect to DB
    const findUser = await dbFindOneBy(User, { where: { user_id: user_id, disabled: false } , relations: ['user_groups'] })
   
    // If user doesnt exist, then throw error
    if (!findUser) {
      throw new NotFound("User not found");
    }
    if (detailed) {
      // return user from db
      return findUser;
    } 

    // return version lite
    const ugLite = [];
    findUser.user_groups.forEach(ug => {
      ugLite.push({
        user_group_id: ug.user_group_id,
        name: ug.name,
        description: ug.description
      });
    });

    const findUserLite: UserRequest = {
      user_id: findUser.user_id,
      name: findUser.user_id,
      preferred_username: findUser.preferred_username,
      phone_number: findUser.phone_number,
      email: findUser.email,
      address: findUser.address,
      locale: findUser.locale,
      birthdate: findUser.birthdate,
      given_name: findUser.given_name,
      family_name: findUser.family_name,
      nickname: findUser.nickname,
      gender: findUser.gender,
      picture: findUser.picture,
      user_groups: ugLite
    };

    return findUserLite;
  }
  public async getUserScopes(user_id: string): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    const findUser = await repository
      .findOne({ user_id: user_id, disabled: false, relations: ['user_groups'] });

    // If user doesnt exist, then throw error
    if (!findUser) {
      throw new NotFound("User not found");
    }

    // No user group attached, throw error
    if (!findUser.user_groups) {
      throw new NotFound("User doesn't belong to any user groups, user has no permissions");
    }

    // get scope groups attached to user groups
    const ugRepository = await connection.getRepository(UserGroup);
    const findUserGroups = await ugRepository
      .find({ where: findUser.user_groups, disabled: false, relations: ['scope_groups'] });

    const scopeGroupIds = [];
    findUserGroups.forEach(usergroup => {
      usergroup.scope_groups.forEach(scopegroup => {
        scopeGroupIds.push({ scope_group_id: scopegroup.scope_group_id, disabled: false });
      })
    });

    // If no scope groups, throw error
    if (!scopeGroupIds) {
      throw new NotFound("No scope groups attached to the user groups, user has no permissions");
    }

    // get scope groups attached to user groups
    const sgRepository = await connection.getRepository(ScopeGroup);
    const findScopeGroups = await sgRepository
      .find({ where: scopeGroupIds, disabled: false, relations: ['scopes'] });

    // Getting user scoeps
    const UserScopes = [];
    findScopeGroups.forEach(sg => {
      sg.scopes.forEach(scope => {
        UserScopes.push(scope.name);
      })
    });

    // Check if users scopes exist
    if (!UserScopes) {
      throw new NotFound("No scopes attached to scope groups!");
    }
    // Remove any duplicate scopes
    const uniqueScopes = [...new Set(UserScopes)];

    return uniqueScopes;
  }
  public async getUsers(detailed: boolean): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    const findUsers = await repository.find({ disabled: false, relations: ['user_groups'] });
 
    // If users doesnt exist, then throw error
    if (!findUsers) {
      throw new NotFound("No users found, table empty");
    }
    if (detailed) {
          // return user
      return findUsers;
    }
    const findUsersLite = [];
    
    findUsers.forEach(findUser => {
      // return version lite
      const ugLite = [];
      findUser.user_groups.forEach(ug => {
        ugLite.push({
          user_group_id: ug.user_group_id,
          name: ug.name,
          description: ug.description
        });
      });

      const findUserLite: UserRequest = {
        user_id: findUser.user_id,
        name: findUser.user_id,
        preferred_username: findUser.preferred_username,
        phone_number: findUser.phone_number,
        email: findUser.email,
        address: findUser.address,
        locale: findUser.locale,
        birthdate: findUser.birthdate,
        given_name: findUser.given_name,
        family_name: findUser.family_name,
        nickname: findUser.nickname,
        gender: findUser.gender,
        picture: findUser.picture,
        user_groups: ugLite
      };

      findUsersLite.push(findUserLite);
    })

    return findUsersLite;
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

    // Check if user groups are valid
    const connection = await auroraConnectApi();
    const ugRepository = await connection.getRepository(UserGroup);
    const addUserGroups = [];
    
    // If user groups are attached to user
    if (body.user_groups) {
      for (let i = 0; i < body.user_groups.length; i++) {
        const findUserGroup = await ugRepository.findOne({ user_group_id: body.user_groups[i].user_group_id });
        if (!findUserGroup) {
          throw new NotFound('User group with id:' + body.user_groups[i].user_group_id + ' does not exist!');
        }

        addUserGroups.push(findUserGroup);
      }
    }

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
      user_groups: addUserGroups
    };
    
    // Save user to DB
    const repository = await connection.getRepository(User);
    const savedUser = await repository.save(newUser);

    // Send verification message
    sendVerificationMessage(newUser, isValidPhoneNumber, isValidEmail);
    
    return savedUser;
  }
  public async updateUser(body: UserRequest): Promise<any> {    
    try {
        // Check if username is of type email or of type phone_number
      await validateUsername(body.preferred_username);

      // Extract info from req object  
      const connection = await auroraConnectApi();
      const repository = await connection.getRepository(User);
      const findUser = await repository.findOne({ user_id: body.user_id, disabled: false });
      
      // If you can't find user, then throw error
      if (!findUser) {
        throw new NotFound("User not found, can't update");
      }

      // Check if user groups exist
      const ugRepository = await connection.getRepository(UserGroup);
      const addUserGroups = [];
      if (body.user_groups) {
        for (let i = 0; i < body.user_groups.length; i++) {
          const findUserGroup = await ugRepository.findOne({ user_group_id: body.user_groups[i].user_group_id });
          if (!findUserGroup) {
            throw new NotFound('User group with id:' + body.user_groups[i].user_group_id + ' does not exist!');
          }
  
          addUserGroups.push(findUserGroup);
        }
      }

      // Only update password if user choose to do so
      if (body.password) {
        // Check password strength
        validatePasswordStrength(body.password);
        
        // Hash user password
        const genPassHash = await generatePasswordHash(body.password);
        const salt = genPassHash.salt;
        const hash = genPassHash.genHash;  
        
        findUser.salt = salt;
        findUser.password = hash;
      } 
      
      // If email got updated, verify it
      if (findUser.email != body.email) {
        findUser.email = body.email;
        sendVerificationMessage(findUser, false, true);
      }

      // If phone got updated, verify it
      if (findUser.phone_number != body.phone_number) {
        findUser.phone_number = body.phone_number;
        sendVerificationMessage(findUser, true, false);
      }
      
      // update user properties
      findUser.preferred_username = body.preferred_username; 
      findUser.given_name = body.given_name;
      findUser.family_name = body.family_name;
      findUser.name = body.name;
      findUser.nickname = body.nickname;
      findUser.gender = body.gender;
      findUser.address = body.address;
      findUser.birthdate = body.birthdate;
      findUser.locale = body.locale;
      findUser.picture = body.picture;
      findUser.user_groups = addUserGroups;

      // Update user
      const updatedUser = await repository.save(findUser);
      
      return updatedUser;
    } 
    catch (e) {
      console.log(e);
    } 
  } 
  public async deleteUser(user_id: string, softDelete: boolean): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);
    const findUser = await repository.findOne({ user_id: user_id });

    // If user doesnt exist, then throw error
    if (!findUser) {
      throw new NotFound("User not found");
    }
    // hard delete user
    if (!softDelete) {
      await repository.delete(findUser);
      return "User has been deleted!";
    }
    // Disable user
    findUser.disabled = true;
    await repository.save(findUser);
    // return user
    return "User disabled successfully!";
  }
}
