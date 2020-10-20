import { agent, token } from "./setup"

let user;

export async function TestUserController() {
  it('should get all users', async () => {
    const res = await agent.get("/user").set('Authorization', 'Bearer ' + token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Success')
  });
  it('should create a user', async () => {
    const res = await agent.post("/user")
        .set('Authorization', 'Bearer ' + token)
        .send({
            "preferred_username": "newAccount@gmail.com",
            "password": "Password@1",
            "phone_number": "+27721234567",
            "email": "newAccount@gmail.com",
            "address": "1 Main Road",
            "locale": "en",
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
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Success')
    user = res.body.data;
  }, 500000);
  it('should get created user', async () => {
    const res = await agent.get("/user/" + user.user_id)
        .set('Authorization', 'Bearer ' + token);

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Success')
    expect(res.body.data.user_id).toEqual(user.user_id)
  }, 500000);
  // it('should modify a user', async () => {
  //   user.address = "Modified Main Road";
  //   const res = await agent.put("/user")
  //       .set('Authorization', 'Bearer ' + token)
  //       .send(user);
  //   expect(res.statusCode).toEqual(200)
  //   expect(res.body).toHaveProperty('message')
  //   expect(res.body.message).toEqual('Success')
  //   expect(res.body.data.address).toEqual("Modified Main Road")
  // }, 500000);
it('delete the created user', async () => {
  const res = await agent.delete("/user/" + user.user_id)
      .set('Authorization', 'Bearer ' + token)
      .send(user);
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('message')
  expect(res.body.message).toEqual('Success')
}, 500000);

}

