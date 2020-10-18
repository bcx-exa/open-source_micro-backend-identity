/* eslint-disable */
import { agent, token } from "./shared/shared"

describe("User Sign up 2", () => {
    it('user profiles', async () => {
        const res = await agent.get("/user").set('Authorization', 'Bearer ' + token)
    });
});
