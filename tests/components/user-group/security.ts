import { agent, token } from "../setup";

export function UserGroupSecurity(user_group_id, user_group) {
  const modifiedToken = token + 'acd';

  it('should be protected "get user groups"', async () => {
    // Do API call
    const res = await agent
      .get("/usergroup")
      .set('Authorization', 'Bearer ' + modifiedToken);

    // Expect result contain
    expect(res.statusCode).toEqual(401);
  });
  it('should be protected "post usergroup"', async () => {
    // Do API call
    const res = await agent
      .post("/usergroup")
      .set('Authorization', 'Bearer ' + modifiedToken)
      .send({
        "name": "test",
        "description": "test",
        "users": [],
        "scope_groups": []
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
  it('should be protected "get created user group"', async () => {
    // Do API call
    const res = await agent
      .get("/usergroup/" + user_group_id)
      .set('Authorization', 'Bearer ' + modifiedToken);
    
    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
  it('should be protected "put user group"', async () => {
    // Do API Call
    const res = await agent.put("/usergroup")
        .set('Authorization', 'Bearer ' + modifiedToken)
        .send(user_group);

    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
it('should be protected "delete user group"', async () => {
  // Do API Call
  const res = await agent.delete("/usergroup/" + user_group_id)
      .set('Authorization', 'Bearer ' + modifiedToken)
      .send(user_group);
    
  // Expect result contain      
  expect(res.statusCode).toEqual(401)
}, 500000);

}

