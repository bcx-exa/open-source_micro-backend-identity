import { agent, token } from "../setup";
export let user_cookie;

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
  it('should load the login page', async () => {
    // Do API call
    const res = await agent
      .get("/auth/signin");
     // Expect result contain
    expect(res.statusCode).toEqual(200);
  });
  it('should login user and return a cookie', async () => {
    // Do API call
    const res = await agent
      .post("/auth/login")
      .send({
        "username": "admin@freedatsandbox.xyz",
        "password": process.env.ADMIN_PASSWORD
      });

    user_cookie = res.headers['set-cookie'];

    // Expect result contain
    expect(res.statusCode).toEqual(302);
  });
}
