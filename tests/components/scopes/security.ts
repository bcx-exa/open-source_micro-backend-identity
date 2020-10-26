import { agent, token } from "../setup";

export function ScopeSecurity(scope_id, scope) {
  const modifiedToken = token + 'acd';

  it('should be protected "get scopes"', async () => {
    // Do API call
    const res = await agent
      .get("/scope")
      .set('Authorization', 'Bearer ' + modifiedToken);

    // Expect result contain
    expect(res.statusCode).toEqual(401);
  });
  it('should be protected "post scope"', async () => {
    // Do API call
    const res = await agent
      .post("/scope")
      .set('Authorization', 'Bearer ' + modifiedToken)
      .send({
        "name": null,
        "description": "test",
        "scope_groups": []
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
  it('should be protected "get created scope"', async () => {
    // Do API call
    const res = await agent
      .get("/scope/" + scope_id)
      .set('Authorization', 'Bearer ' + modifiedToken);
    
    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
  it('should be protected "put scope"', async () => {
    // Do API Call
    const res = await agent.put("/scope")
        .set('Authorization', 'Bearer ' + modifiedToken)
        .send(scope);

    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
it('should be protected "delete scope"', async () => {
  // Do API Call
  const res = await agent.delete("/scope/" + scope_id)
      .set('Authorization', 'Bearer ' + modifiedToken)
      .send(scope);
    
  // Expect result contain      
  expect(res.statusCode).toEqual(401)
}, 500000);

}

