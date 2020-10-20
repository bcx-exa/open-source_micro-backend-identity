import { Server } from "../../src/server";
const expressApp = new Server();
import request from "supertest";
let agent, token, server;

beforeAll(async () => {
    server = await expressApp.Start();
    agent = request(expressApp.app);

});

afterAll(async () => {
    await server.close();
});

describe("Unit Test Environment Setup", async () => {
    it("Should setup test DB", async function () {
        await agent.post("/admin/initial_scope_creation")
    }, 500000);
    it("Should get an access token", async function () {
        const res = await agent.get("/oauth/token_test")
        expect(res.body).toHaveProperty('access_token')
        token = res.body.access_token;      
    }, 500000);
})



export {
    agent, token
}