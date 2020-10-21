import { agent, token } from "../setup";
export let user, user_id;

export async function UserBasic() {
  it('should get all users', async () => {
    // Do API call
    const res = await agent
      .get("/user")
      .set('Authorization', 'Bearer ' + token);

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
  });
  it('should create a user', async () => {
    // Do API call
    const res = await agent
      .post("/user")
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
        });
    
    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');

    // Asign Global Variable to be used in other tests
    user_id = res.body.data.user_id;
  }, 500000);
  it('should get created user', async () => {
    // Do API call
    const res = await agent
      .get("/user/" + user_id)
      .set('Authorization', 'Bearer ' + token);
    
    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
    expect(res.body.data.user_id).toEqual(user_id);

    // Asign Global Variable to be used in other tests
    user = res.body.data;
  }, 500000);
  it('should modify a user', async () => {
    // Remove nulls and modify global user
    Object.keys(user).forEach(key => (user[key] == null) && delete user[key]);
    user.address = "Modified Main Road";

    // Do API Call
    const res = await agent.put("/user")
        .set('Authorization', 'Bearer ' + token)
        .send(user);

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
    expect(res.body.data.address).toEqual("Modified Main Road");
  }, 500000);
it('should delete the created user', async () => {
  // Do API Call
  const res = await agent.delete("/user/" + user_id)
      .set('Authorization', 'Bearer ' + token)
      .send(user);
    
  // Expect result contain      
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('message')
  expect(res.body.message).toEqual('Success')
}, 500000);

}

