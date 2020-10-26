import { agent, token } from "../setup";

export function ScopeGroupExceptions() {
  it('should throw Not Found Exception', async () => {
    // Do API call
    const res = await agent
      .get("/scopegroup/123")
      .set('Authorization', 'Bearer ' + token);
    // Expect result contain
    expect(res.statusCode).toEqual(404);
  });
  it('should throw Validation Exception', async () => {
    // Do API call
    const res = await agent
      .post("/scopegroup")
      .set('Authorization', 'Bearer ' + token)
      .send({
        "name": null,
        "description": "test",
        "scopes": [],
        "user_groups": [],
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(422);
    expect(res.body.message).toEqual('Validation Failed');
  }, 500000);
}

