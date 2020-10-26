import { agent, token } from "../setup";

export function AuthenticationExceptions() {
  it('should throw Password Policy Exception', async () => {
    // Do API call
    const res = await agent
      .post("/auth/signup")
      .set('Authorization', 'Bearer ' + token)
      .send({
        "preferred_username": "john123@gmail.com",
        "password": "123",
        "accepted_legal_version": "string",
        "given_name": "string",
        "family_name": "string"
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(406);
    expect(res.body.name).toEqual("Password Policy Exception")
  }, 500000);
  it('should throw Invalid email or phone number', async () => {
    // Do API call
    const res = await agent
      .post("/auth/signup")
      .set('Authorization', 'Bearer ' + token)
      .send({
        "preferred_username": "johngmail.com",
        "password": "ZAQ!@wsx34",
        "accepted_legal_version": "string",
        "given_name": "string",
        "family_name": "string"
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('Not a valid phone number or email address');
  }, 500000);

  it('should throw Validation Exception', async () => {
    // Do API call
    const res = await agent
      .post("/auth/signup")
      .set('Authorization', 'Bearer ' + token)
      .send({
        "preferred_username": null,
        "password": "ZAQ!@wsx34",
        "accepted_legal_version": "string",
        "given_name": "string",
        "family_name": "string"
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(422);
    expect(res.body.message).toEqual('Validation Failed');
  }, 500000);
}

