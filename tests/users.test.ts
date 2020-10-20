/* eslint-disable */
import { agent, token } from "./shared/shared"

describe("Users", () => {
    it('Get Users', async () => {
        const res = await agent.get("/user").set('Authorization', 'Bearer ' + token)
    });
    // it('Create user', async () => {
    //     const res = await agent.post("/user").set('Authorization', 'Bearer ' + token)
    //         .send({
    //             "user_id": "string",
    //             "preferred_username": "newAccount@gmail.com",
    //             "password": "Password@1",
    //             "phone_number": "+27721234567",
    //             "email": "newAccount@gmail.com",
    //             "address": "1 Main Road",
    //             "locale": "en",
    //             "birthdate": "2020-10-19T06:38:37.613Z",
    //             "name": "Test User",
    //             "given_name": "Test",
    //             "family_name": "User",
    //             "accepted_legal_version": "v1",
    //             "nickname": "Test",
    //             "gender": "Other",
    //             "picture": "None"
    //         })
    //     console.log("user", res)
    //     expect(res.statusCode).toEqual(200)
    //     expect(res.body).toHaveProperty('message')
    //     expect(res.body.message).toEqual('Success')
    // });



});
