import { agent, token } from "../setup";
export let scope_group, scope_group_id;

export function ScopeGroupBasic() {
  it('should get all scope groups', async () => {
    // Do API call
    const res = await agent
      .get("/scopegroup")
      .set('Authorization', 'Bearer ' + token);

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
  });
  it('should create a scope group', async () => {
    // Do API call
    const res = await agent
      .post("/scopegroup")
      .set('Authorization', 'Bearer ' + token)
      .send({
        "name": "test",
        "description": "test",
        "scopes": [],
        "user_groups": [],
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');

    // Asign Global Variable to be used in other tests
    scope_group_id = res.body.data.scope_group_id;
  }, 500000);
  it('should get created scope group', async () => {
    // Do API call
    const res = await agent
      .get("/scopegroup/" + scope_group_id)
      .set('Authorization', 'Bearer ' + token);
        // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
    expect(res.body.data.scope_group_id).toEqual(scope_group_id);

    // Asign Global Variable to be used in other tests
    scope_group = res.body.data;
  }, 500000);
  it('should modify a scope group', async () => {
    // Remove nulls and modify global user
    Object.keys(scope_group).forEach(key => (scope_group[key] == null) && delete scope_group[key]);
    scope_group.description = "Modified Scope Group";

    // Do API Call
    const res = await agent.put("/scopegroup")
        .set('Authorization', 'Bearer ' + token)
        .send(scope_group);

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
    expect(res.body.data.description).toEqual("Modified Scope Group");
  }, 500000);
it('should delete the created scope group', async () => {
  // Do API Call
  const res = await agent.delete("/scopegroup/" + scope_group_id)
      .set('Authorization', 'Bearer ' + token)
      .send(scope_group);
    
  // Expect result contain      
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('message')
  expect(res.body.message).toEqual('Success')
}, 500000);

}

