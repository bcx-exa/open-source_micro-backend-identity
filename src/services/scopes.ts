import { Scopes } from "../models/scope";
import { ScopeGroup } from "../models/scope-group";
import { UserGroup } from "../models/user-group";
import { Conflict, NotFound } from '../types/response_types';
import { auroraConnectApi } from "../components/database/connection";
import { ScopeRequest, Scope_ScopeGroup_Request } from "../types/scopes";
import { v4 as uuidv4 } from 'uuid';
import { UserService } from "./user";

export class ScopesService {
  public async getScope(scope_id: string, detailed: boolean): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Scopes);
    const findScope = await repository
      .findOne({ scope_id: scope_id, disabled: false, relations: ['scopes', 'user_groups'] });

    // If user doesnt exist, then throw error
    if (!findScope) {
      throw new NotFound("Scope not found");
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
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Scopes);
    const findScopes = await repository
      .find({ disabled: false, relations: ['scope_groups'] });
    
    // If user doesnt exist, then throw error
    if (!findScopes) {
      throw new NotFound("No scopes found, table empty");
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
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Scopes);
    const date = new Date();

    const findScope = await repository.findOne({ name: body.name, disabled: false });

    // if name already exists, throw error
    if (findScope) {
      throw new Conflict("Scope Name already exists!");
    } 
    const addScopeGroups = [];
    if (body.scope_groups) {     
      // Check if scope group exists
      const sgRepository = await connection.getRepository(ScopeGroup);

      if (body.scope_groups) {
        for (let i = 0; i < body.scope_groups.length; i++) {
          const findSG = await sgRepository.findOne({ scope_group_id: body.scope_groups[i].scope_group_id });
          if (!findSG) {
            throw new NotFound('Scope with id:' + body.scope_groups[i].scope_group_id + ' does not exist!');
          }
          addScopeGroups.push(findSG);
        }
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
    const newScope = await repository.save(scope);
    
    // Return user group
    return newScope;
  }
  public async updateScope(body: ScopeRequest): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Scopes);
    const date = new Date();

    const findScope = await repository.findOne({ scope_id: body.scope_id, disabled: false });

    if (!findScope) {
      throw new NotFound('Scope doesnt exist, cant update');
    }
    const addScopeGroups = [];
    if (body.scope_groups) {     
      // Check if scope group exists
      const sgRepository = await connection.getRepository(ScopeGroup);

      if (body.scope_groups) {
        for (let i = 0; i < body.scope_groups.length; i++) {
          const findSG = await sgRepository.findOne({ scope_group_id: body.scope_groups[i].scope_group_id });
          if (!findSG) {
            throw new NotFound('Scope with id:' + body.scope_groups[i].scope_group_id + ' does not exist!');
          }
          addScopeGroups.push(findSG);
        }
      }
    }
 
    // Update values
    findScope.name = body.name;
    findScope.description = body.description;
    findScope.updated_at = date;
    findScope.scope_groups = addScopeGroups;
      
    // Save to DB
    await repository.save(findScope);

    // Return updated user
    return findScope;     
  }
  public async deleteScope(scope_id: string, softDelete: boolean): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Scopes);
    const findScope = await repository
      .findOne({ scope_id: scope_id, relations: ['scopes', 'user_groups'] });
  
    // If user doesnt exist, then throw error
    if (!findScope) {
      throw new NotFound("Scope not found");
    }

    if (!softDelete) {
      // Delete scope
      repository.delete(findScope);
      return "Scope has been deleted!";
    }
    
    // Just disable 
    findScope.disabled = true;
    await repository.save(findScope);
    
    return "Scope has been disabled";
  }
  public async defaultIdentityScope(): Promise<any> {
    // User
    const date = new Date();
    // Scopes
    const defaultScopes = [
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:get:basic", description: "Permission to get your own user information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:get:admin", description: "Permission to get a specific user's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:get_all:admin", description: "Permission to get all user's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:put:basic", description: "Permission to modify your own information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:put:admin", description: "Permission to modify a specific user's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:post:basic", description: "Permission to add your own information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:post:admin", description: "Permission to add a user information to the system" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:delete:basic", description: "Permission to delete your own information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:delete:admin", description: "Permission to delete a user's information to the system" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:get_scopes:basic", description: "Permission to get a list of all your scopes" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:user:get_scopes:admin", description: "Permission to get a list of the specific user's scopes" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:usergroups:get:admin", description: "Permission to get a specific user group's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:usergroups:get_all:admin", description: "Permission to get all user group's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:usergroups:put:admin", description: "Permission to modify a specific user group's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:usergroups:post:admin", description: "Permission to add a user information to the system" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:usergroups:delete:admin", description: "Permission to delete a user group's information from the system" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:scopegroups:get:admin", description: "Permission to get a specific scope group's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:scopegroups:get_all:admin", description: "Permission to get all scope group's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:scopegroups:put:admin", description: "Permission to modify a specific scope group's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:scopegroups:post:admin", description: "Permission to add a scope information to the system" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:scopegroups:delete:admin", description: "Permission to delete a scope group's information from the system" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:scopes:get:admin", description: "Permission to get a specific scope's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:scopes:get_all:admin", description: "Permission to get all scope's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:scopes:put:admin", description: "Permission to modify a specific scope's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:scopes:post:admin", description: "Permission to add a scope information to the system" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:scopes:delete:admin", description: "Permission to delete a scope's information from the system" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:clients:get:admin", description: "Permission to get a specific client's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:clients:get_all:admin", description: "Permission to get all client's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:clients:put:admin", description: "Permission to modify a specific client's information" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:clients:post:admin", description: "Permission to add a client information to the system" },
      { created_at: date, updated_at: date, disabled: false, name: "identity:clients:delete:admin", description: "Permission to delete a client's information from the system" },
    ];
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Scopes);
    const saveScopes = await repository.save(defaultScopes);

    // Extract scopes by type
    const adminScopes = saveScopes.filter(scope => scope.name.includes('admin'));
    const basicScopes = saveScopes.filter(scope => scope.name.includes('basic'));

    // scope groups
    const scopeGroups = [
      { created_at: date, updated_at: date, disabled: false, name: "Basic Scope Group", description: "All permissions deemed to be of a basic level", scopes: basicScopes },
      { created_at: date, updated_at: date, disabled: false, name: "Admin Scope Group", description: "All permissions deemed to be of an admin level", scopes: adminScopes }
    ]
    
    const sgRepository = await connection.getRepository(ScopeGroup);
    const saveScopeGroups = await sgRepository.save(scopeGroups);

    // Extract scope groups by type
    const basicGroupScopes = saveScopeGroups.filter(sg => sg.name.includes('Basic'));
    const adminGroupScopes = saveScopeGroups.filter(sg => sg.name.includes('Admin'));

    const userGroups = [
      { created_at: date, updated_at: date, disabled: false, name: "Basic User Group", description: "A basic user group", scope_groups: basicGroupScopes },
      { created_at: date, updated_at: date, disabled: false, name: "Admin User Group", description: "A Admin user group", scope_groups: adminGroupScopes }
    ]

    const ugRepository = await connection.getRepository(UserGroup);
    const saveUserGroups = await ugRepository.save(userGroups);
    
    const basicUserGroup = saveUserGroups.filter(ug => ug.name.includes('Basic'));
    const adminUserGroup = saveUserGroups.filter(ug => ug.name.includes('Admin'));

    // Base users
    const users = [{
      name: "Basic Identity User",
      preferred_username: "basic@" + process.env.DOMAIN,
      password: "ZAQ!@wsx3456",
      phone_number: null,
      email: "basic@" + process.env.DOMAIN,
      disabled: false,
      user_groups: basicUserGroup
    },
    {
      name: "Admin Identity User",
      preferred_username: "admin@" + process.env.DOMAIN,
      password: "ZAQ!@wsx3456",
      phone_number: null,
      email: "admin@" + process.env.DOMAIN,
      disabled: false,
      user_groups: adminUserGroup
    }];
    
    for (let i = 0; i < users.length; i++) {
      await new UserService().createUser(users[i]);
    }

    return users;
    
  }
}
