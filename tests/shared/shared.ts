import { Server } from "../../src/server";
const expressApp = new Server();
import request from "supertest";
let agent, token, server;

beforeAll(async () => {
    server = await expressApp.Start();
    agent = request(expressApp.app);

});

afterAll(async () => {
    await server.close(async () => {
        console.log('Http server closed.');
    });
});

test("Login to the application", async function () {
    const res = await agent.get("/oauth/token_test")
    token = res.body.access_token;
    return;
}, 500000);

export {
    agent, token
}