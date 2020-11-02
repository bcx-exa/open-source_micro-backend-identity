import { agent, token } from "../setup";
import { user_cookie } from "../authentication";

export function AuthorizationBasic() {
  it('should grant a code', async () => {
    // Do API call
    const res = await agent
      .get("/oauth/authorize")
      .set('set-cookie', user_cookie)
      .query({ 
        client_id: "b69d3b97-84f8-4503-8b13-c212603827e6",
        client_secret: "123",
        redirect_uri: "http://localhost:" + process.env.PORT,
        scopes: "openid profile email phone"
      });
     
      console.log(res.statusCode);
      console.log(res.body);
      console.log(res.headers);

    // // Expect result contain
    // expect(res.statusCode).toEqual(200);
    // expect(res.body).toHaveProperty('message');
    // expect(res.body.message).toEqual('Success');
  });
}

