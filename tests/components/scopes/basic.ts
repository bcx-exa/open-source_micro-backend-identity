import { agent, token } from "../setup";
export let scope, scope_id;

export function ScopeBasic() {
  it('should get all scopes', async () => {
    // Do API call
    const res = await agent
      .get("/scope")
      .set('Authorization', 'Bearer ' + token);

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
  });
  it('should create a scope', async () => {
    // Do API call
    const res = await agent
      .post("/scope")
      .set('Authorization', 'Bearer ' + token)
      .send({
        "name": "test",
        "description": "test",
        "scope_groups": []
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');

    // Asign Global Variable to be used in other tests
    scope_id = res.body.data.scope_id;
  }, 500000);
  it('should get created scope', async () => {
    // Do API call
    const res = await agent
      .get("/scope/" + scope_id)
      .set('Authorization', 'Bearer ' + token);
        // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
    expect(res.body.data.scope_id).toEqual(scope_id);

    // Asign Global Variable to be used in other tests
    scope = res.body.data;
  }, 500000);
  it('should modify a scope', async () => {
    // Remove nulls and modify global user
    Object.keys(scope).forEach(key => (scope[key] == null) && delete scope[key]);
    scope.description = "Modified Scope";

    // Do API Call
    const res = await agent.put("/scope")
        .set('Authorization', 'Bearer ' + token)
        .send(scope);

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
    expect(res.body.data.description).toEqual("Modified Scope");
  }, 500000);
it('should delete the created scope', async () => {
  // Do API Call
  const res = await agent.delete("/scope/" + scope_id)
      .set('Authorization', 'Bearer ' + token)
      .send(scope);
    
  // Expect result contain      
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('message')
  expect(res.body.message).toEqual('Success')
}, 500000);

}

