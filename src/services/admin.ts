//import { User } from "../models/user";
import { UserGroup } from "../models/user-group";
import { UserGroupRequest } from "../types/admin";
import { InvalidFormat } from "../components/handlers/error-handling";
// import { Scope } from "../models/scope";
// import { User } from "../models/user";
// import { ScopeGroup } from "../models/scope-group";
// import { Client } from "../models/client"; 
//import { validatePasswordHash, generatePasswordHash } from "../components/security/crypto";
//import { Conflict, Unauthorized, NotVerified, InvalidFormat } from "../components/handlers/error-handling";
import { auroraConnectApi } from "../components/database/aurora";
//import { validateUsername, validatePasswordStrength } from "../components/handlers/validation";
import { v4 as uuidv4 } from 'uuid';

export class AdminService {
  
  // Users
  // public async getUser() {
  //   return;
  // }

  // public async getUsers() {
  //   return;
  // }

  // public async createUser() {
  //   return;
  // }

  // public async deleteUser() {
  //   return;
  // }

  // public async getUserGroup() {
  //   return;
  // }

  // public async getUserGroups() { 
  //   return;
  // }

  public async createUserGroup(body: UserGroupRequest ): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(UserGroup);
    const date = new Date();

    // find user group by name 
    if (!body.user_group_id && body.name) {
      const findUserGroupByName = await repository.findOne({ name: body.name });

      // if name already exists, throw error
      if (findUserGroupByName) {
        throw new InvalidFormat("User Group Name already exists!");
      } 
    }

    // find user group by id, update name
    if (body.user_group_id) {
      const findUserGroupById = await repository.findOne({ user_group_id: body.user_group_id });
      
      // Udpate user group
      if (findUserGroupById) {
        // Update values
        findUserGroupById.name = body.name;
        findUserGroupById.updated_at = date;
        findUserGroupById.scope_groups = body.scope_groups;
        findUserGroupById.users = body.users;
        
        // Save to DB
        await repository.save(findUserGroupById);

        // Return updated user
        return findUserGroupById;
      }
    } else {
        // Create new user group
        const userGroup: UserGroup = {
          user_group_id: uuidv4(),
          name: body.name,
          created_at: date,
          updated_at: date,
          disabled: false,
          users: body.users,
          scope_groups: body.scope_groups
        };

        // Save new user group
        const newUserGroup = await repository.save(userGroup);
        
        // Return user group
        return newUserGroup;
      }
    }

  // public async deleteUserGroup() {
  //   return;
  // }

  // public async getScopeGroup() {
  //   return;
  // }

  // public async getScopeGroups() {
  //   return;
  // }

  // public async createScopeGroup() {
  //   return;
  // }

  // public async deleteScopeGroup() {
  //   return;
  // }



  // public async getScope() {
  //   return;
  // }

  // public async getScopes() {
  //   return;
  // }

  // public async createScope() {
  //   return;
  // }

  // public async deleteScope() {
  //   return;
  // }

}
