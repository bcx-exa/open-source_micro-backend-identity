import { agent, token } from "../setup";

export function UserGroupExceptions() {
  it('should throw Not Found Exception', async () => {
    // Do API call
    const res = await agent
      .get("/usergroup/123")
      .set('Authorization', 'Bearer ' + token);
    // Expect result contain
    expect(res.statusCode).toEqual(404);
  });
  
  it('should throw Validation Exception', async () => {
    // Do API call
    const res = await agent
      .post("/usergroup")
      .set('Authorization', 'Bearer ' + token)
      .send({
        "name": null,
        "description": "test",
        "users": [],
        "scope_groups": []
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(422);
    expect(res.body.message).toEqual('Validation Failed');
  }, 500000);
}

