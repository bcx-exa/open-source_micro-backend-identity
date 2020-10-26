import { agent, token } from "../setup";

export function UserExceptions() {
  it('should throw Not Found Exception', async () => {
    // Do API call
    const res = await agent
      .get("/user/123")
      .set('Authorization', 'Bearer ' + token);
    // Expect result contain
    expect(res.statusCode).toEqual(404);
  });
  it('should throw Password Policy Exception', async () => {
    // Do API call
    const res = await agent
      .post("/user")
      .set('Authorization', 'Bearer ' + token)
      .send({
            "preferred_username": "newAccount@gmail.com",
            "password": "123",
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
    expect(res.statusCode).toEqual(406);
    expect(res.body.name).toEqual("Password Policy Exception")
  }, 500000);
  it('should throw Invalid email or phone number', async () => {
    // Do API call
    const res = await agent
      .post("/user")
      .set('Authorization', 'Bearer ' + token)
      .send({
            "preferred_username": "123",
            "password": "123",
            "phone_number": "123",
            "email": "123",
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
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('Not a valid phone number or email address');
  }, 500000);

  it('should throw Validation Exception', async () => {
    // Do API call
    const res = await agent
      .post("/user")
      .set('Authorization', 'Bearer ' + token)
      .send({
            "preferred_username": null,
            "password": "123",
            "phone_number": "123",
            "email": "123",
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
    expect(res.statusCode).toEqual(422);
    expect(res.body.message).toEqual('Validation Failed');
  }, 500000);
}

