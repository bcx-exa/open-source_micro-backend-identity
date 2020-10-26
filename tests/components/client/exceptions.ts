import { agent, token } from "../setup";

export function ClientExceptions() {
  it('should throw Not Found Exception', async () => {
    // Do API call
    const res = await agent
      .get("/client/123")
      .set('Authorization', 'Bearer ' + token);
    // Expect result contain
    expect(res.statusCode).toEqual(404);
  });

  it('should throw Validation Exception', async () => {
    // Do API call
    const res = await agent
      .post("/client")
      .set('Authorization', 'Bearer ' + token)
      .send({
        "client_name": null,
        "client_secret": "123",
        "trusted": true,
        "redirect_uris": [
          "string"
        ]
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(422);
    expect(res.body.message).toEqual('Validation Failed');
  }, 500000);
}

