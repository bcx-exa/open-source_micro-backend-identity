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
                "phone_number": "string",
                "email": "string",
                "address": "string",
                "locale": "string",
                "birthdate": "2020-10-19T06:38:37.613Z",
                "name": "string",
                "given_name": "string",
                "family_name": "string",
                "accepted_legal_version": "string",
                "nickname": "string",
                "gender": "string",
                "picture": "string",
                "user_groups": [
                    {
                        "user_group_id": "string",
                        "name": "string",
                        "description": "string"
                    }
                ]
            })
        expect(res.statusCode).toEqual(200)
    });



});
