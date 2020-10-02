import { Scopes } from "../models/scope";
import { ScopeGroup } from "../models/scope-group";
import { UserGroup } from "../models/user-group";
import { auroraConnectApi } from "../components/database/connection";
import { UserService } from "./user";

export class AdminService {
  public async defaultSchema(): Promise<any> {
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
