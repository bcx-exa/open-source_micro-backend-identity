/* eslint-disable */
import { agent, token } from "./shared/shared"

describe("Users", () => {
    it('Get Users', async () => {
        const res = await agent.get("/user").set('Authorization', 'Bearer ' + token)
    });
    it('Crreate user', async () => {
        const res = await agent.post("/user").set('Authorization', 'Bearer ' + token)
            .send({
                "user_id": "string",
                "preferred_username": "string",
                "password": "string",
                "phone_number": "+27",
                "email": "string",
                "address": "string",
                "locale": "string",
                "birthdate": "2020-10-19T06:38:37.613Z",
                "name": "Test User",
                "given_name": "Test",
                "family_name": "User",
                "accepted_legal_version": "v1",
                "nickname": "Test",
                "gender": "Other",
                "picture": "None"
            })
        expect(res.statusCode).toEqual(200)
    });



});
