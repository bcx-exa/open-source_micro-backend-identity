import { User } from "../models/user";
import { UserGroup } from "../models/user-group";
import { ScopeGroup } from "../models/scope-group";
import { UserGroupRequest, UserGroup_User_Request, UserGorup_ScopeGroup_Request } from "../types/user-groups";
import { NotFound, Conflict } from "../types/response_types";
import { v4 as uuidv4 } from 'uuid';
import { dbDelete, dbFindManyBy, dbFindOneBy, dbSaveOrUpdate } from "../components/database/db-helpers";

export class UserGroupService {
  // User Groups
  public async getUserGroup(user_group_id: string, detailed: boolean): Promise<any> {
        // Connect to DB
    const findUserGroup = await dbFindOneBy(UserGroup, { where: { user_group_id: user_group_id, disabled: false }, relations: ['users', 'scope_groups'] });
    // If user doesnt exist, then throw error
    if (findUserGroup instanceof NotFound) {
      throw findUserGroup
    }
    if (detailed) {
          // return user
      return findUserGroup;
    }
    const usersLite = [];
    const scopeGroupsLite = [];

    if (findUserGroup.users) {
      findUserGroup.users.forEach(user => {
        const userLite: UserGroup_User_Request = {
          user_id: user.user_id,
          preferred_username: user.preferred_username
        };
        usersLite.push(userLite);
      });
    }

    if (findUserGroup.scope_groups) {
      findUserGroup.scope_groups.forEach(user => {
        const scopeGroupLite: UserGorup_ScopeGroup_Request = {
          scope_group_id: user.scope_group_id,
          name: user.name,
          description: user.description
        };
        scopeGroupsLite.push(scopeGroupLite);
      });
    }

    const findUserGroupLite: UserGroupRequest = {
      user_group_id: findUserGroup.user_group_id,
      name: findUserGroup.name,
      description: findUserGroup.description,
      users: usersLite,
      scope_groups: scopeGroupsLite
    };

    return findUserGroupLite;
  }
  public async getUserGroups(detailed: boolean): Promise<any> { 
    // Connect to DB
    const findUserGroups = await dbFindManyBy(UserGroup, { where: { disabled: false }, relations:['users', 'scope_groups']});

    // If user doesnt exist, then throw error
    if (findUserGroups instanceof NotFound) {
      throw findUserGroups;
    }
    if (detailed) {
          // return user
      return findUserGroups;
    }
    const findUserGroupsLite = [];

    findUserGroups.forEach(findUserGroup => {
      const usersLite = [];
      const scopeGroupsLite = [];

      if (findUserGroup.users) {
        findUserGroup.users.forEach(user => {
          const userLite: UserGroup_User_Request = {
            user_id: user.user_id,
            preferred_username: user.preferred_username
          };
          usersLite.push(userLite);
        });
      }

      if (findUserGroup.scope_groups) {
        findUserGroup.scope_groups.forEach(user => {
          const scopeGroupLite: UserGorup_ScopeGroup_Request = {
            scope_group_id: user.scope_group_id,
            name: user.name,
            description: user.description
          };
          scopeGroupsLite.push(scopeGroupLite);
        });
      }

      const findUserGroupLite: UserGroupRequest = {
        user_group_id: findUserGroup.user_group_id,
        name: findUserGroup.name,
        description: findUserGroup.description,
        users: usersLite,
        scope_groups: scopeGroupsLite
      };
      findUserGroupsLite.push(findUserGroupLite);
    })
    return findUserGroupsLite;
  }
  public async createUserGroup(body: UserGroupRequest ): Promise<any> {
    // Connect to DB
    const date = new Date();
    const findUserGroupByName = await dbFindOneBy(UserGroup, { name: body.name });

    // if name already exists, throw error
    if (!(findUserGroupByName instanceof NotFound)) {
      throw new Conflict("User Group Name already exists!");
    }

    // Check if users exist
    const addUsers = [];
    if (body.users) {
      for (let i = 0; i < body.users.length; i++) {
        const findUser = await dbFindOneBy(User, { user_id: body.users[i].user_id });
        if (findUser instanceof NotFound) {
          throw findUser;
        }
        addUsers.push(findUser);
      }
    }

    // Check if scope groups exist
    const addScopeGroups = [];
    if (body.scope_groups) {
      for (let i = 0; i < body.scope_groups.length; i++) {
        const findSG = await dbFindOneBy(ScopeGroup, { scope_group_id: body.scope_groups[i].scope_group_id });
        if (!findSG) {
          throw new NotFound('Scope Group with id:' + body.scope_groups[i].scope_group_id + ' does not exist!');
        }
        addScopeGroups.push(findSG);
      }
    }

    // Create new user group
    const userGroup: UserGroup = {
      user_group_id: uuidv4(),
      name: body.name,
      description: body.description,
      created_at: date,
      updated_at: date,
      disabled: false,
      users: addUsers,
      scope_groups: addScopeGroups
    };

    // Save new user group
    const newUserGroup = await dbSaveOrUpdate(UserGroup, userGroup);
    
    // Return user group
    return newUserGroup;
  } 
  public async updateUserGroup(body: UserGroupRequest ): Promise<any> {
    // Connect to DB
    const date = new Date();

    const findUserGroupById = await dbFindOneBy(UserGroup, { user_group_id: body.user_group_id, disabled: false });
    
    if (findUserGroupById instanceof NotFound) {
      throw findUserGroupById;
    }

    // Check if users exist
    const addUsers = [];
    if (body.users) {
      for (let i = 0; i < body.users.length; i++) {
        const findUser = await dbFindOneBy(User, { user_id: body.users[i].user_id });
        if (findUser instanceof NotFound) {
          throw findUser;
        }
        addUsers.push(findUser);
      }
    }

    // Check if scope groups exist
    const addScopeGroups = [];
    if (body.scope_groups) {
      for (let i = 0; i < body.scope_groups.length; i++) {
        const findSG = await dbFindOneBy(ScopeGroup, { scope_group_id: body.scope_groups[i].scope_group_id });
        if (findSG instanceof NotFound) {
          throw findSG;
        }
        addScopeGroups.push(findSG);
      }
    }
     
    // Update values
    findUserGroupById.user_group_id = body.user_group_id;
    findUserGroupById.name = body.name;
    findUserGroupById.description = body.description;
    findUserGroupById.updated_at = date;
    findUserGroupById.users = addUsers;
    findUserGroupById.scope_groups = addScopeGroups;

    // Save to DB
    await dbSaveOrUpdate(UserGroup, findUserGroupById);

    // Return updated user
    return findUserGroupById;
  } 
  public async deleteUserGroup(user_group_id: string, softDelete: boolean): Promise<any> {
    // Connect to DB
    const findUserGroup = await dbFindOneBy(UserGroup, { user_group_id: user_group_id });

    // If user doesnt exist, then throw error
    if (findUserGroup instanceof NotFound) {
      throw findUserGroup;
    }

    // Hard delete
    if (!softDelete) {
      return await dbDelete(UserGroup, findUserGroup);
    }

    // Soft delete
    findUserGroup.disabled = true
    return await dbSaveOrUpdate(UserGroup, findUserGroup);
  }
}
