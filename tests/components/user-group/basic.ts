import { agent, token } from "../setup";
export let user_group, user_group_id;

export function UserGroupBasic() {
  it('should get all user groups', async () => {
    // Do API call
    const res = await agent
      .get("/usergroup")
      .set('Authorization', 'Bearer ' + token);

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
  });
  it('should create a user group', async () => {
    // Do API call
    const res = await agent
      .post("/usergroup")
      .set('Authorization', 'Bearer ' + token)
      .send({
        "name": "test",
        "description": "test",
        "users": [],
        "scope_groups": []
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');

    // Asign Global Variable to be used in other tests
    user_group_id = res.body.data.user_group_id;
  }, 500000);
  it('should get created user group', async () => {
    // Do API call
    const res = await agent
      .get("/usergroup/" + user_group_id)
      .set('Authorization', 'Bearer ' + token);
    
    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
    expect(res.body.data.user_group_id).toEqual(user_group_id);

    // Asign Global Variable to be used in other tests
    user_group = res.body.data;
  }, 500000);
  it('should modify a user group', async () => {
    // Remove nulls and modify global user
    Object.keys(user_group).forEach(key => (user_group[key] == null) && delete user_group[key]);
    user_group.description = "Modified Description";

    // Do API Call
    const res = await agent.put("/usergroup")
        .set('Authorization', 'Bearer ' + token)
        .send(user_group);

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
    expect(res.body.data.description).toEqual("Modified Description");
  }, 500000);
it('should delete the created user', async () => {
  // Do API Call
  const res = await agent.delete("/usergroup/" + user_group_id)
      .set('Authorization', 'Bearer ' + token)
      .send(user_group);
    
  // Expect result contain      
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('message')
  expect(res.body.message).toEqual('Success')
}, 500000);

}

