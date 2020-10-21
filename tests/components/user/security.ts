import { agent, token } from "../setup";

export async function UserSecurity(user_id, user) {
  const modifiedToken = token + 'acd';

  it('should be protected "get users"', async () => {
    // Do API call
    const res = await agent
      .get("/user")
      .set('Authorization', 'Bearer ' + modifiedToken);

    // Expect result contain
    expect(res.statusCode).toEqual(401);
  });
  it('should be protected "create a user"', async () => {
    // Do API call
    const res = await agent
      .post("/user")
      .set('Authorization', 'Bearer ' + modifiedToken)
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
    expect(res.statusCode).toEqual(401);
  }, 500000);
  it('should be protected "get created user"', async () => {
    // Do API call
    const res = await agent
      .get("/user/" + user_id)
      .set('Authorization', 'Bearer ' + modifiedToken);
    
    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
  it('should be protected "modify created user"', async () => {
    // Do API Call
    const res = await agent.put("/user")
        .set('Authorization', 'Bearer ' + modifiedToken)
        .send(user);

    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
it('should be protected "delete created user"', async () => {
  // Do API Call
  const res = await agent.delete("/user/" + user_id)
      .set('Authorization', 'Bearer ' + modifiedToken)
      .send(user);
    
  // Expect result contain      
  expect(res.statusCode).toEqual(401)
}, 500000);

}

