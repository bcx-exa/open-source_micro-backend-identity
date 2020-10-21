/* eslint-disable */
import { user, user_id, UserBasic, UserSecurity, UserExceptions } from "./components/user";

// User Controller Tests
describe("User Contoller - Basic Functionality", async () => {
    await UserBasic();
});

describe("User Contoller - Security", async () => {
    await UserSecurity(user_id, user);
});

// describe("User Contoller - Exceptions", async () => {
//     await UserExceptions(agent, token, user_id, user);
// });


// Scope Controller Test