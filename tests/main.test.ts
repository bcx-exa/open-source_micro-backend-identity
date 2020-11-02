/* eslint-disable */
import { user, user_id, UserBasic, UserSecurity, UserExceptions } from "./components/user";
import { user_group, user_group_id, UserGroupBasic, UserGroupSecurity, UserGroupExceptions } from "./components/user-group";
import { scope, scope_id, ScopeBasic, ScopeSecurity, ScopeExceptions } from "./components/scopes";
import { scope_group, scope_group_id, ScopeGroupBasic, ScopeGroupSecurity, ScopeGroupExceptions } from "./components/scope_groups";
import { client, client_id, ClientBasic, ClientSecurity, ClientExceptions } from "./components/client";
import { AuthenticationBasic, AuthenticationExceptions } from "./components/authentication";
import { AuthorizationBasic } from "./components/authorization";
// Authentication Controller Tests
describe("Authentication Contoller - Basic Functionality", ()=> {
    AuthenticationBasic();
});

describe("Authentication Contoller - Exceptions", () => {
    AuthenticationExceptions();
});

describe("Oauth Contoller - Basic Functionality", () => {
    AuthorizationBasic();
});

//User Controller Tests
// describe("User Contoller - Basic Functionality", () => {
//     UserBasic();
// });

// describe("User Contoller - Security",  () => {
//     UserSecurity(user_id, user);
// });

// describe("User Contoller - Exceptions", () => {
//     UserExceptions();
// });

// User Group Controller Tests
// describe("User Group Contoller - Basic Functionality",  () => {
//      UserGroupBasic();
// });

// describe("User Group Contoller - Security", () => {
//     UserGroupSecurity(user_group_id, user_group);
// });

// describe("User Group Contoller - Exceptions", () => {
//     UserGroupExceptions();
// });


// Scope Controller Test
// describe("Scope Contoller - Basic Functionality",  () => {
//     ScopeBasic();
// });

// describe("Scope Contoller - Security",  () => {
//      ScopeSecurity(scope_id, scope);
// });

// describe("Scope Contoller - Exceptions", () => {
//     ScopeExceptions();
// });

// Scope Groups
// describe("Scope Group Contoller - Basic Functionality",  () => {
//     ScopeGroupBasic();
// });

// describe("Scope Group Contoller - Security",() => {
//      ScopeGroupSecurity(scope_group_id, scope_group);
// });

// describe("Scope Group Contoller - Exceptions",() => {
//      ScopeGroupExceptions();
// });

// Clients
// describe("Client Contoller - Basic Functionality",() => {
//      ClientBasic();
// });

// describe("Client Contoller - Security",() => {
//      ClientSecurity(client_id, client);
// });

// describe("Client Contoller - Exceptions",() => {
//      ClientExceptions();
// });