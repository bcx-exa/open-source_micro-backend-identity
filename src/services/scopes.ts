import { Scopes } from "../models/scope";
import { ScopeGroup } from "../models/scope-group";
import { NotFound } from '../types/response_types';
import { ScopeRequest, Scope_ScopeGroup_Request } from "../types/scopes";
import { v4 as uuidv4 } from 'uuid';
import { dbFindOneBy, dbFindManyBy, dbSaveOrUpdate, dbDelete } from "../components/database/db-helpers";

export class ScopesService {
  public async getScope(scope_id: string, detailed: boolean): Promise<any> {
    // Connect to DB
    const findScope = await 
      dbFindOneBy(Scopes, { where: { scope_id: scope_id, disabled: false }, relations: ['scope_groups'] });

    // If user doesnt exist, then throw error
    if (findScope instanceof NotFound) {
      throw NotFound;
    }
    if (detailed) {
      return findScope;
    }
     // else return a lite version of db object
     const scopeGroupsLite = [];
 
     // Check user groups exists
     if (findScope.scope_groups) {
       findScope.scope_groups.forEach(sg => {
         const scopeGroupLite: Scope_ScopeGroup_Request = {
           scope_group_id: sg.scope_group_id,
           name: sg.name,
           description: sg.description
         };
         scopeGroupsLite.push(scopeGroupLite);
       });
     }
      
     // create lite object
     const findScopeLite: ScopeRequest = {
       scope_id: findScope.scope_id,
       name: findScope.name,
       description: findScope.description,
       scope_groups: scopeGroupsLite
     };
 
     // return lite object
     return findScopeLite;
  }
  public async getScopes(detailed: boolean): Promise<any> {
    // Connect to DB
    const findScopes = await
      dbFindManyBy(Scopes, { disabled: false, relations: ['scope_groups'] });
    
    // If user doesnt exist, then throw error
    if (findScopes instanceof NotFound) {
      throw findScopes;
    }

    if (detailed) {
      return findScopes;
    }
    
    // else return a lite version of db object 
    const findScopesLite = [];

    findScopes.forEach(findScope => {
      const scopeGroupsLite = [];
      // / Check user groups exists
      if (findScope.scope_groups) {
        findScope.scope_groups.forEach(sg => {
          const scopeGroupLite: Scope_ScopeGroup_Request = {
            scope_group_id: sg.scope_group_id,
            name: sg.name,
            description: sg.description
          };
          scopeGroupsLite.push(scopeGroupLite);
        });
      }
      
      // create lite object
      const findScopeLite: ScopeRequest = {
        scope_id: findScope.scope_id,
        name: findScope.name,
        description: findScope.description,
        scope_groups: scopeGroupsLite
      };
      findScopesLite.push(findScopeLite);
    })
  
    // return lite object
    return findScopesLite;
  }
  public async createScope(body: ScopeRequest): Promise<any> {
    // Connect to DB
    const date = new Date();
    const findScope = await dbFindOneBy(Scopes, { name: body.name, disabled: false });

    // if name already exists, throw error
    if (!(findScope instanceof NotFound)) {
      throw findScope;
    } 
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

    const scope: Scopes = {
      scope_id: uuidv4(),
      name: body.name,
      description: body.description,
      created_at: date,
      updated_at: date,
      disabled: false,
      scope_groups: addScopeGroups
    };

    // Save new user group
    const newScope = await dbSaveOrUpdate(Scopes, scope);
    
    // Return user group
    return newScope;
  }
  public async updateScope(body: ScopeRequest): Promise<any> {
    // Connect to DB
    const date = new Date();
    const findScope = await dbFindOneBy(Scopes, { scope_id: body.scope_id, disabled: false });

    if (findScope instanceof NotFound) {
      throw findScope;
    }
    const addScopeGroups = [];
    if (body.scope_groups) {         
      for (let i = 0; i < body.scope_groups.length; i++) {
        const findSG = await dbFindOneBy(ScopeGroup, { scope_group_id: body.scope_groups[i].scope_group_id });
        if (findSG instanceof NotFound) {
          throw NotFound;
        }
        addScopeGroups.push(findSG);
      }     
    }
 
    // Update values
    findScope.name = body.name;
    findScope.description = body.description;
    findScope.updated_at = date;
    findScope.scope_groups = addScopeGroups;
      
    // Save to DB
    await dbSaveOrUpdate(Scopes, findScope);

    // Return updated user
    return findScope;     
  }
  public async deleteScope(scope_id: string, softDelete: boolean): Promise<any> {
    // Connect to DB
    const findScope = await 
      dbFindOneBy(Scopes, { where: { scope_id: scope_id }, relations: ['scope_groups'] });
  
    // If user doesnt exist, then throw error
    if (findScope instanceof NotFound) {
      throw findScope;
    }

    if (!softDelete) {
      // Delete scope
      await dbDelete(Scopes, findScope);
      return "Scope has been deleted!";
    }
    
    // Just disable 
    findScope.disabled = true;
    await dbSaveOrUpdate(Scopes, findScope);
    
    return "Scope has been disabled";
  }
}
