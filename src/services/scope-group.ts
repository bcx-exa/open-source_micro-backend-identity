import { ScopeGroup } from "../models/scope-group";
import { Conflict, NotFound } from '../types/response_types';
import { auroraConnectApi } from "../components/database/connection";
import { v4 as uuidv4 } from 'uuid';
import { ScopeGroupRequest, ScopeGroup_UserGroup_Request, ScopeGroup_Scope_Request } from "../types/scope-group";
import { UserGroup } from "../models/user-group";
import { Scopes } from "../models/scope";
import { dbDelete, dbFindManyBy, dbFindOneBy, dbSaveOrUpdate } from "../components/database/db-helpers";
export class ScopeGroupService {
  // Scope Groups
  public async getScopeGroup(scope_group_id: string, detailed: boolean): Promise<any> {
    // Connect to DB
    const findScopeGroup = await dbFindOneBy(ScopeGroup, { where: { scope_group_id: scope_group_id, disabled: false }, relations: ['scopes', 'user_groups'] });

    // If user doesnt exist, then throw error
    if (findScopeGroup instanceof NotFound) {
      throw findScopeGroup
    }
    // If detailed, then return db object
    if (detailed) {
      return findScopeGroup;
    }

    // else return a lite version of db object
    const userGroupsLite = [];
    const scopesLite = [];

    // Check user groups exists
    if (findScopeGroup.user_groups) {
      findScopeGroup.user_groups.forEach(ug => {
        const userGroupLite: ScopeGroup_UserGroup_Request = {
          user_group_id: ug.user_group_id,
          name: ug.name,
          description: ug.description
        };
        userGroupsLite.push(userGroupLite);
      });
    }

    // Check scope groups exist
    if (findScopeGroup.scopes) {
      findScopeGroup.scopes.forEach(scope => {
        const scopeLite: ScopeGroup_Scope_Request = {
          scope_id: scope.scope_id,
          name: scope.name,
          description: scope.description
        };
        scopesLite.push(scopeLite);
      });
    }

    // create lite object
    const findScopeGroupLite: ScopeGroupRequest = {
      scope_group_id: findScopeGroup.scope_group_id,
      name: findScopeGroup.name,
      description: findScopeGroup.description,
      user_groups: userGroupsLite,
      scopes: scopesLite
    };

    // return lite object
    return findScopeGroupLite;
  }
  public async getScopeGroups(detailed: boolean): Promise<any> {
    // Connect to DB
    const findScopeGroups = await dbFindManyBy(ScopeGroup, { disabled: false, relations: ['scopes', 'user_groups'] });

    // If user doesnt exist, then throw error
    if (findScopeGroups instanceof NotFound) {
      throw findScopeGroups;
    }

    // If detailed 
    if (detailed) {
      return findScopeGroups;
    }
    
    const findScopeGroupsLite = [];

    findScopeGroups.forEach(findScopeGroup => {
      // else return a lite version of db object
      const userGroupsLite = [];
      const scopesLite = [];
  
      // Check user groups exists
      if (findScopeGroup.user_groups) {
        findScopeGroup.user_groups.forEach(ug => {
          const userGroupLite: ScopeGroup_UserGroup_Request = {
            user_group_id: ug.user_group_id,
            name: ug.name,
            description: ug.description
          };
          userGroupsLite.push(userGroupLite);
        });
      }
  
      // Check scope groups exist
      if (findScopeGroup.scopes) {
        findScopeGroup.scopes.forEach(scope => {
          const scopeLite: ScopeGroup_Scope_Request = {
            scope_id: scope.scope_id,
            name: scope.name,
            description: scope.description
          };
          scopesLite.push(scopeLite);
        });
      }
  
      // create lite object
      const findScopeGroupLite: ScopeGroupRequest = {
        scope_group_id: findScopeGroup.scope_group_id,
        name: findScopeGroup.name,
        description: findScopeGroup.description,
        user_groups: userGroupsLite,
        scopes: scopesLite
      };

      findScopeGroupsLite.push(findScopeGroupLite);
    });

    return findScopeGroupsLite;

  }
  public async createScopeGroup(body: ScopeGroupRequest): Promise<any> {
    // Conect to DB
    const date = new Date();

    // Check if scope exists
    const findScopeGroup = await dbFindOneBy(ScopeGroup, { name: body.name, disabled: false });

    // if name already exists, throw error
    if (!(findScopeGroup instanceof NotFound)) {
      throw new Conflict("Scopegroup already exists");
    } 

    // Check if users exist
    const addUserGroup = [];
    if (body.user_groups) {
      for (let i = 0; i < body.user_groups.length; i++) {
        const findUG = await dbFindOneBy(UserGroup, { user_group_id: body.user_groups[i].user_group_id });
        if (findUG instanceof NotFound) {
          throw findUG;
        }
        addUserGroup.push(findUG);
      }
    }
 
    // Check if scope groups exist
    const addScopes = [];
    if (body.scopes) {
      for (let i = 0; i < body.scopes.length; i++) {
        const findS = await dbFindOneBy(Scopes, { scope_id: body.scopes[i].scope_id });
        if (findS instanceof NotFound) {
          throw NotFound;
        }
        addScopes.push(findS);
      }
    }

    const scopeGroup: ScopeGroup = {
      scope_group_id: uuidv4(),
      name: body.name,
      description: body.description,
      created_at: date,
      updated_at: date,
      disabled: false,
      user_groups: addUserGroup,
      scopes: addScopes
    };

    // Save new user group
    const newScopeGroup = await dbSaveOrUpdate(ScopeGroup, scopeGroup);
    
    // Return user group
    return newScopeGroup;
  }
  public async updateScopeGroup(body: ScopeGroupRequest): Promise<any> {
    // Check if scope exists
    const date = new Date();
    const findScopeGroup = await dbFindOneBy(ScopeGroup, { scope_group_id: body.scope_group_id, disabled: false });

    // if name already exists, throw error
    if (findScopeGroup instanceof NotFound) {
      throw findScopeGroup;
    } 
    
    // Check if users exist
    const addUserGroup = [];
    if (body.user_groups) {
      for (let i = 0; i < body.user_groups.length; i++) {
        const findUG = await dbFindOneBy(UserGroup, { user_group_id: body.user_groups[i].user_group_id });
        if (findUG instanceof NotFound) {
          throw findUG;
        }
        addUserGroup.push(findUG);
      }
    }

    // Check if scope groups exist
    const addScopes = [];
    if (body.scopes) {
      for (let i = 0; i < body.scopes.length; i++) {
        const findS = await dbFindOneBy(Scopes, { scope_id: body.scopes[i].scope_id });
        if (findS instanceof NotFound) {
          throw findS;
        }
        addScopes.push(findS);
      }
    }
    // Update values
    findScopeGroup.name = body.name;
    findScopeGroup.updated_at = date;
    findScopeGroup.description = body.description;
    findScopeGroup.user_groups = addUserGroup;
    findScopeGroup.scopes = addScopes;

    // Save to DB
    const savedFindScopeGroup = await dbSaveOrUpdate(ScopeGroup, findScopeGroup);

    // Return updated user
    return savedFindScopeGroup;
  }
  public async deleteScopeGroup(scope_group_id: string, softDelete: boolean): Promise<any> {
    // Connect to DB
    const findScopeGroup = await dbFindOneBy(ScopeGroup, { where: { scope_group_id: scope_group_id }, relations: ['scopes', 'user_groups'] });


    // If user doesnt exist, then throw error
    if (findScopeGroup instanceof NotFound) {
      throw NotFound;
    }

    // hard delete
    if (!softDelete) {
      await dbDelete(ScopeGroup, findScopeGroup);
      return "Scope group has been deleted";
    }

    findScopeGroup.disabled = true;
    await dbSaveOrUpdate(ScopeGroup, findScopeGroup);

    return "Scope group has been disabled";
  }
}
