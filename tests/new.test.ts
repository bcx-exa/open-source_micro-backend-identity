/* eslint-disable */
import { Server } from "../src/server";
const expressApp = new Server();

const request = require('supertest');
let agent, token;
beforeAll(async () => {
    await expressApp.Start();
    agent = request(expressApp.app);
});

describe("User Sign up", () => {
    it('renders user profile', async () => {
        const res = await agent.get("/oauth/token_test")
        console.log(res.body.access_token)
        token = res.body.access_token;
    });
    it('user profile', async () => {
        const res = await agent.get("/user").set('Authorization', 'Bearer ' + token)
        console.log(res.body)
    });
});
