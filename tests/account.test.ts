/* eslint-disable */
import { agent, token } from "./shared/shared"

describe("Account", () => {
    test(`Send Password Reset Request`, async () => {
        const res = await agent
            .post('/account/password_reset_request')
            .send({
                "preferred_username": "noPassword@gmail.com",
            })
        expect(res.statusCode).toEqual(406)
        expect(res.body).toHaveProperty('name')
    }, 30000);
})