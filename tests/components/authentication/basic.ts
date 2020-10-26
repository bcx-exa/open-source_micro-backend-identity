import { agent, token } from "../setup";
export let user, user_id;

export function AuthenticationBasic() {
  it('should signup user', async () => {
    // Do API call
    const res = await agent
      .post("/auth/signup")
      .send({
        "preferred_username": "john@gmail.com",
        "password": "ZAQ!@wsx34",
        "accepted_legal_version": "string",
        "given_name": "string",
        "family_name": "string"
      });

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success: Please verify your account!');
  });
  it('should load the signin page', async () => {
    // Do API call
    const res = await agent
      .get("/auth/signin");
     // Expect result contain
    expect(res.statusCode).toEqual(200);
  });
  it('should signin user', async () => {
    // Do API call
    const res = await agent
      .post("/auth/signin")
      .send({
        "username": "basic@freedatsandbox.xyz",
        "password": "ZAQ!@wsx34"
      });

    // Expect result contain
    expect(res.statusCode).toEqual(200);
  });
}

