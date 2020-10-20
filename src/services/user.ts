import { UserRequest } from "../types/user";
import { User } from "../models/user";
import { UserGroup } from "../models/user-group";
import { ScopeGroup } from "../models/scope-group";
import { generatePasswordHash } from "../components/security/crypto";
import { NotFound, Conflict, InternalServerError } from "../types/response_types";
import { auroraConnectApi } from "../components/database/connection";
import { dbFindOneBy, dbFindManyBy, dbSaveOrUpdate, dbDelete } from "../components/database/db-helpers";
import { validateUsername, validatePasswordStrength } from "../components/handlers/validation";
import { sendVerificationMessage } from "../components/messaging/account-verification";
import { v4 as uuidv4 } from 'uuid';


export class UserService {
  // Users
  public async getUser(user_id: string, detailed: boolean): Promise<any> {
    // Connect to DB
    const findUser = await dbFindOneBy(User, { where: { user_id: user_id, disabled: false }, relations: ['user_groups'] })

    // If user doesnt exist, then throw error
    if (findUser instanceof NotFound) {
      throw findUser;
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
      name: findUser.name,
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
    const findUser = await dbFindOneBy(User, { where: { user_id: user_id, disabled: false }, relations: ['user_groups'] })

    // If user doesnt exist, then throw error
    if (!findUser) {
      throw findUser;
    }

    // No user group attached, throw error
    if (!Array.isArray(findUser.user_groups) || findUser.user_groups.length == 0) {
      throw new NotFound("User doesn't belong to any user groups, user has no permissions");
    }

    // get scope groups attached to user groups    
    const findUserGroups = await dbFindManyBy(UserGroup, { where: findUser.user_groups, disabled: false, relations: ['scope_groups'] });

    const scopeGroupIds = [];
    findUserGroups.forEach(usergroup => {
      usergroup.scope_groups.forEach(scopegroup => {
        scopeGroupIds.push({ scope_group_id: scopegroup.scope_group_id, disabled: false });
      })
    });

    // If no scope groups, throw error
    if (!Array.isArray(scopeGroupIds) || scopeGroupIds.length == 0) {
      throw new NotFound("No scope groups attached to the user groups, user has no permissions");
    }

    // get scope groups attached to user groups
    const findScopeGroups = await dbFindManyBy(ScopeGroup, { where: scopeGroupIds, disabled: false, relations: ['scopes'] });

    // Getting user scoeps
    const UserScopes = [];
    findScopeGroups.forEach(sg => {
      sg.scopes.forEach(scope => {
        UserScopes.push(scope.name);
      })
    });

    // Check if users scopes exist
    if (!Array.isArray(UserScopes) || UserScopes.length == 0) {
      throw new NotFound("No scopes attached to scope groups!");
    }
    // Remove any duplicate scopes
    const uniqueScopes = [...new Set(UserScopes)];

    return uniqueScopes;
  }
  public async getUsers(detailed: boolean): Promise<any> {
    // Connect to DB
    const findUsers = await dbFindManyBy(User, { disabled: false, relations: ['user_groups'] });

    // If users doesnt exist, then throw error
    if (findUsers instanceof NotFound) {
      throw findUsers;
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
        name: findUser.name,
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
    const isSystemAccount = (body.preferred_username == "basic@" + process.env.DOMAIN || "admin@" + process.env.DOMAIN);
    // Check if username is of type email or of type phone_number
    const validPreferredUsername = validateUsername(body.preferred_username);
    const isValidEmail = validPreferredUsername.isValidEmail;
    const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;

    // Check if user exists
    const findCondition = isValidEmail
      ? { email: body.preferred_username, disabled: false }
      : { phone_number: body.preferred_username, disabled: false };

    const findUser = await dbFindOneBy(User, findCondition);

    // If user exist throw conflict error
    if (!(findUser instanceof NotFound)) {
      throw new Conflict('User already exists');
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
      accepted_legal_version: body.accepted_legal_version,
      email: isValidEmail ? body.preferred_username : null,
      birthdate: null,
      email_verified: isSystemAccount ? true : false,
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
    const savedUser = await dbSaveOrUpdate(User, newUser);

    // Send verification message
    if (!isSystemAccount) {
      sendVerificationMessage(newUser, isValidPhoneNumber, isValidEmail);
    }

    return savedUser;
  }
  public async updateUser(body: UserRequest): Promise<any> {
    try {
      // Check if username is of type email or of type phone_number
      await validateUsername(body.preferred_username);

      // Extract info from req object  
      const findUser = await dbFindOneBy(User, { user_id: body.user_id, disabled: false });

      // If you can't find user, then throw error
      if (findUser instanceof NotFound) {
        throw findUser;
      }

      // Check if user groups exist
      const addUserGroups = [];
      if (body.user_groups) {
        for (let i = 0; i < body.user_groups.length; i++) {
          const findUserGroup = await dbFindManyBy(UserGroup, { user_group_id: body.user_groups[i].user_group_id });
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
      findUser.accepted_legal_version = body.accepted_legal_version;
      findUser.picture = body.picture;
      findUser.user_groups = addUserGroups;

      // Update user
      const updatedUser = await dbSaveOrUpdate(User, findUser);

      return updatedUser;
    }
    catch (e) {
      throw new InternalServerError('Something went wrong when saving the user', 500, e);
    }
  }
  public async deleteUser(user_id: string, softDelete: boolean): Promise<any> {
    try {
      // Connect to DB
      const findUser = await dbFindOneBy(User, { user_id: user_id });

      // If user doesnt exist, then throw error
      if (findUser instanceof NotFound) {
        throw findUser;
      }
      // hard delete user
      if (!softDelete) {
        await dbDelete(User, findUser);
        return "User has been deleted!";
      }
      // Disable user
      findUser.disabled = true;
      await dbSaveOrUpdate(User, findUser);
      // return user
      return "User disabled successfully!";
    } catch (e) {
      throw new InternalServerError('Something went wrong when deleting/disabling the user', 500, e);
    }
  }
}
