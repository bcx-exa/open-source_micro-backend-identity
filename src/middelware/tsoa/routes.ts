/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AccountController } from './../../controllers/account';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminController } from './../../controllers/admin';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthenticationController } from './../../controllers/authentication';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ClientController } from './../../controllers/client';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OidcController } from './../../controllers/oidc';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ScopeGroupController } from './../../controllers/scope-group';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ScopeController } from './../../controllers/scope';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserGroupController } from './../../controllers/user-group';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../../controllers/user';
import { expressAuthentication } from './../passport/passport';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  "InternalServerError": {
    "dataType": "refObject",
    "properties": {
      "stack": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "VerifyResend": {
    "dataType": "refObject",
    "properties": {
      "preferred_username": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "PasswordResetRequest": {
    "dataType": "refObject",
    "properties": {
      "preferred_username": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "PasswordReset": {
    "dataType": "refObject",
    "properties": {
      "password": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "SignUp": {
    "dataType": "refObject",
    "properties": {
      "preferred_username": { "dataType": "string", "required": true },
      "password": { "dataType": "string", "required": true },
      "given_name": { "dataType": "string", "required": true },
      "family_name": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "SignIn": {
    "dataType": "refObject",
    "properties": {
      "preferred_username": { "dataType": "string", "required": true },
      "password": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ScopeGroup_Scope_Request": {
    "dataType": "refObject",
    "properties": {
      "scope_id": { "dataType": "string", "required": true },
      "name": { "dataType": "string" },
      "description": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ScopeGroup_UserGroup_Request": {
    "dataType": "refObject",
    "properties": {
      "user_group_id": { "dataType": "string", "required": true },
      "name": { "dataType": "string" },
      "description": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ScopeGroupRequest": {
    "dataType": "refObject",
    "properties": {
      "scope_group_id": { "dataType": "string" },
      "name": { "dataType": "string" },
      "description": { "dataType": "string" },
      "scopes": { "dataType": "array", "array": { "ref": "ScopeGroup_Scope_Request" } },
      "user_groups": { "dataType": "array", "array": { "ref": "ScopeGroup_UserGroup_Request" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Scope_ScopeGroup_Request": {
    "dataType": "refObject",
    "properties": {
      "scope_group_id": { "dataType": "string", "required": true },
      "name": { "dataType": "string" },
      "description": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ScopeRequest": {
    "dataType": "refObject",
    "properties": {
      "scope_id": { "dataType": "string" },
      "name": { "dataType": "string" },
      "description": { "dataType": "string" },
      "scope_groups": { "dataType": "array", "array": { "ref": "Scope_ScopeGroup_Request" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "UserGroup_User_Request": {
    "dataType": "refObject",
    "properties": {
      "user_id": { "dataType": "string" },
      "preferred_username": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "UserGorup_ScopeGroup_Request": {
    "dataType": "refObject",
    "properties": {
      "scope_group_id": { "dataType": "string", "required": true },
      "name": { "dataType": "string" },
      "description": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "UserGroupRequest": {
    "dataType": "refObject",
    "properties": {
      "user_group_id": { "dataType": "string" },
      "name": { "dataType": "string" },
      "description": { "dataType": "string" },
      "users": { "dataType": "array", "array": { "ref": "UserGroup_User_Request" } },
      "scope_groups": { "dataType": "array", "array": { "ref": "UserGorup_ScopeGroup_Request" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "User_UserGroup_Request": {
    "dataType": "refObject",
    "properties": {
      "user_group_id": { "dataType": "string", "required": true },
      "name": { "dataType": "string" },
      "description": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "UserRequest": {
    "dataType": "refObject",
    "properties": {
      "user_id": { "dataType": "string" },
      "preferred_username": { "dataType": "string" },
      "password": { "dataType": "string" },
      "phone_number": { "dataType": "string" },
      "email": { "dataType": "string" },
      "address": { "dataType": "string" },
      "locale": { "dataType": "string" },
      "birthdate": { "dataType": "datetime" },
      "name": { "dataType": "string" },
      "given_name": { "dataType": "string" },
      "family_name": { "dataType": "string" },
      "nickname": { "dataType": "string" },
      "gender": { "dataType": "string" },
      "picture": { "dataType": "string" },
      "user_groups": { "dataType": "array", "array": { "ref": "User_UserGroup_Request" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Express) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################
  app.post('/account/verify/resend',
    function(request: any, response: any, next: any) {
      const args = {
        username: { "in": "body", "name": "username", "required": true, "ref": "VerifyResend" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AccountController();


      const promise = controller.VerifyResend.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/account/verify',
    authenticateMiddleware([{ "jwt-query": [] }]),
    function(request: any, response: any, next: any) {
      const args = {
        token: { "in": "query", "name": "token", "required": true, "dataType": "string" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AccountController();


      const promise = controller.VerifyGet.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/account/password/reset/request',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "PasswordResetRequest" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AccountController();


      const promise = controller.PasswordRequestPost.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/account/password/reset',
    authenticateMiddleware([{ "jwt-query": [] }]),
    function(request: any, response: any, next: any) {
      const args = {
        token: { "in": "query", "name": "token", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "PasswordReset" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AccountController();


      const promise = controller.PasswordResetPost.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/admin/rest_redirect',
    function(request: any, response: any, next: any) {
      const args = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AdminController();


      const promise = controller.testRedirect.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/admin/default_schema',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AdminController();


      const promise = controller.addDefaultSchema.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/admin/authz',
    function(request: any, response: any, next: any) {
      const args = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AdminController();


      const promise = controller.testAuthz.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/auth/signup',
    function(request: any, response: any, next: any) {
      const args = {
        signUp: { "in": "body", "name": "signUp", "required": true, "ref": "SignUp" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AuthenticationController();


      const promise = controller.SignUpPost.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/auth/signin',
    function(request: any, response: any, next: any) {
      const args = {
        response_type: { "in": "query", "name": "response_type", "required": true, "dataType": "string" },
        scope: { "in": "query", "name": "scope", "required": true, "dataType": "string" },
        client_id: { "in": "query", "name": "client_id", "required": true, "dataType": "string" },
        client_secret: { "in": "query", "name": "client_secret", "required": true, "dataType": "string" },
        state: { "in": "query", "name": "state", "required": true, "dataType": "string" },
        signIn: { "in": "body", "name": "signIn", "required": true, "ref": "SignIn" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AuthenticationController();


      const promise = controller.SignInPost.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/auth/openid',
    authenticateMiddleware([{ "openid": [] }]),
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AuthenticationController();


      const promise = controller.testing.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/auth/google',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AuthenticationController();


      const promise = controller.SignInGoogle.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/auth/facebook',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new AuthenticationController();


      const promise = controller.SignInFacebook.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/client/:clientName',
    function(request: any, response: any, next: any) {
      const args = {
        clientName: { "in": "path", "name": "clientName", "required": true, "dataType": "string" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ClientController();


      const promise = controller.GetClient.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/client',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ClientController();


      const promise = controller.GetClients.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/client',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "clientSecret": { "dataType": "string", "required": true }, "clientName": { "dataType": "string", "required": true } } },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ClientController();


      const promise = controller.CreateClient.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.put('/client',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "clientSecret": { "dataType": "string", "required": true }, "clientName": { "dataType": "string", "required": true } } },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ClientController();


      const promise = controller.UpdateClient.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.delete('/client/:clientName',
    function(request: any, response: any, next: any) {
      const args = {
        clientName: { "in": "path", "name": "clientName", "required": true, "dataType": "string" },
        softDelete: { "default": true, "in": "query", "name": "softDelete", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ClientController();


      const promise = controller.DeleteClient.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/oidc/auth',
    function(request: any, response: any, next: any) {
      const args = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new OidcController();


      const promise = controller.Auth.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/oidc/device/auth',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new OidcController();


      const promise = controller.DeviceAuth.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/oidc/session/end',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new OidcController();


      const promise = controller.SessionEnd.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/oidc/jwks',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new OidcController();


      const promise = controller.Jwks.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/oidc/token',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new OidcController();


      const promise = controller.Token.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/oidc/me',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new OidcController();


      const promise = controller.Me.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/oidc/introspection',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new OidcController();


      const promise = controller.Introspection.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/oidc/token/revocation',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new OidcController();


      const promise = controller.TokenRevocation.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/scopegroup/:scope_group_id',
    function(request: any, response: any, next: any) {
      const args = {
        scope_group_id: { "in": "path", "name": "scope_group_id", "required": true, "dataType": "string" },
        detailed: { "default": false, "in": "query", "name": "detailed", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeGroupController();


      const promise = controller.GetScopeGroup.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/scopegroup',
    function(request: any, response: any, next: any) {
      const args = {
        detailed: { "default": false, "in": "query", "name": "detailed", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeGroupController();


      const promise = controller.GetScopeGroups.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/scopegroup',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "ScopeGroupRequest" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeGroupController();


      const promise = controller.PostScopeGroups.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.put('/scopegroup',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "ScopeGroupRequest" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeGroupController();


      const promise = controller.PutScopeGroups.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.delete('/scopegroup/:scope_group_id',
    function(request: any, response: any, next: any) {
      const args = {
        scope_group_id: { "in": "path", "name": "scope_group_id", "required": true, "dataType": "string" },
        softDelete: { "default": true, "in": "query", "name": "softDelete", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeGroupController();


      const promise = controller.DeleteUserGroup.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/scope/:scope_id',
    function(request: any, response: any, next: any) {
      const args = {
        scope_id: { "in": "path", "name": "scope_id", "required": true, "dataType": "string" },
        detailed: { "default": false, "in": "query", "name": "detailed", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeController();


      const promise = controller.GetScope.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/scope',
    function(request: any, response: any, next: any) {
      const args = {
        detailed: { "default": false, "in": "query", "name": "detailed", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeController();


      const promise = controller.GetScopes.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/scope',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "ScopeRequest" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeController();


      const promise = controller.PostScope.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.put('/scope',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "ScopeRequest" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeController();


      const promise = controller.PutScope.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.delete('/scope/:scope_id',
    function(request: any, response: any, next: any) {
      const args = {
        scope_id: { "in": "path", "name": "scope_id", "required": true, "dataType": "string" },
        softDelete: { "default": true, "in": "query", "name": "softDelete", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeController();


      const promise = controller.DeleteScope.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/scope/default_scopes',
    function(request: any, response: any, next: any) {
      const args = {
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ScopeController();


      const promise = controller.addDefaultScope.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/usergroup/:user_group_id',
    function(request: any, response: any, next: any) {
      const args = {
        user_group_id: { "in": "path", "name": "user_group_id", "required": true, "dataType": "string" },
        detailed: { "default": false, "in": "query", "name": "detailed", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserGroupController();


      const promise = controller.GetUserGroup.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/usergroup',
    function(request: any, response: any, next: any) {
      const args = {
        detailed: { "default": false, "in": "query", "name": "detailed", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserGroupController();


      const promise = controller.GetUsers.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/usergroup',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "UserGroupRequest" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserGroupController();


      const promise = controller.PostUserGroups.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.put('/usergroup',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "UserGroupRequest" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserGroupController();


      const promise = controller.PutUserGroups.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.delete('/usergroup/:user_group_id',
    function(request: any, response: any, next: any) {
      const args = {
        user_group_id: { "in": "path", "name": "user_group_id", "required": true, "dataType": "string" },
        softDelete: { "default": true, "in": "query", "name": "softDelete", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserGroupController();


      const promise = controller.DeleteUserGroup.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/user/:user_id',
    function(request: any, response: any, next: any) {
      const args = {
        detailed: { "default": false, "in": "query", "name": "detailed", "dataType": "boolean" },
        user_id: { "in": "path", "name": "user_id", "required": true, "dataType": "string" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserController();


      const promise = controller.GetUser.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/user',
    function(request: any, response: any, next: any) {
      const args = {
        detailed: { "default": false, "in": "query", "name": "detailed", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserController();


      const promise = controller.GetUsers.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/user/scopes/:user_id',
    function(request: any, response: any, next: any) {
      const args = {
        user_id: { "in": "path", "name": "user_id", "required": true, "dataType": "string" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserController();


      const promise = controller.GetUserScopes.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/user',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "UserRequest" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserController();


      const promise = controller.PostUsers.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.put('/user',
    function(request: any, response: any, next: any) {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "UserRequest" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserController();


      const promise = controller.PutUsers.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.delete('/user/:user_id',
    function(request: any, response: any, next: any) {
      const args = {
        user_id: { "in": "path", "name": "user_id", "required": true, "dataType": "string" },
        softDelete: { "default": true, "in": "query", "name": "softDelete", "dataType": "boolean" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserController();


      const promise = controller.DeleteUsers.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return (request: any, _response: any, next: any) => {
      let responded = 0;
      let success = false;

      const succeed = function(user: any) {
        if (!success) {
          success = true;
          responded++;
          request['user'] = user;
          next();
        }
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      const fail = function(error: any) {
        responded++;
        if (responded == security.length && !success) {
          error.status = error.status || 401;
          next(error)
        }
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      for (const secMethod of security) {
        if (Object.keys(secMethod).length > 1) {
          let promises: Promise<any>[] = [];

          for (const name in secMethod) {
            promises.push(expressAuthentication(request, name, secMethod[name]));
          }

          Promise.all(promises)
            .then((users) => { succeed(users[0]); })
            .catch(fail);
        } else {
          for (const name in secMethod) {
            expressAuthentication(request, name, secMethod[name])
              .then(succeed)
              .catch(fail);
          }
        }
      }
    }
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function isController(object: any): object is Controller {
    return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
  }

  function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
    return Promise.resolve(promise)
      .then((data: any) => {
        let statusCode;
        let headers;
        if (isController(controllerObj)) {
          headers = controllerObj.getHeaders();
          statusCode = controllerObj.getStatus();
        }

        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

        returnHandler(response, statusCode, data, headers)
      })
      .catch((error: any) => next(error));
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
    Object.keys(headers).forEach((name: string) => {
      response.set(name, headers[name]);
    });
    if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
      data.pipe(response);
    } else if (data || data === false) { // === false allows boolean result
      response.status(statusCode || 200).json(data);
    } else {
      response.status(statusCode || 204).end();
    }
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown> {
    return function(status, data, headers) {
      returnHandler(response, status, data, headers);
    };
  };

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function getValidatedArgs(args: any, request: any, response: any): any[] {
    const fieldErrors: FieldErrors = {};
    const values = Object.keys(args).map((key) => {
      const name = args[key].name;
      switch (args[key].in) {
        case 'request':
          return request;
        case 'query':
          return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
        case 'path':
          return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
        case 'header':
          return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
        case 'body':
          return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
        case 'body-prop':
          return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
        case 'res':
          return responder(response);
      }
    });

    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidateError(fieldErrors, '');
    }
    return values;
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
