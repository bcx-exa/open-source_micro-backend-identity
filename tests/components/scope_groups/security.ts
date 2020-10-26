import { agent, token } from "../setup";

export function ScopeGroupSecurity(scope_group_id, scope_group) {
  const modifiedToken = token + 'acd';

  it('should be protected "get scope groups"', async () => {
    // Do API call
    const res = await agent
      .get("/scopegroup")
      .set('Authorization', 'Bearer ' + modifiedToken);

    // Expect result contain
    expect(res.statusCode).toEqual(401);
  });
  it('should be protected "post scope groups"', async () => {
    // Do API call
    const res = await agent
      .post("/scopegroup")
      .set('Authorization', 'Bearer ' + modifiedToken)
      .send({
            "preferred_username": "newAccount@gmail.com",
            "password": "Password@1",
            "phone_number": "+27721234567",
            "email": "newAccount@gmail.com",
            "address": "1 Main Road",
            "locale": "en",
            "birthdate": "2020-10-19T06:38:37.613Z",
            "name": "Test User",
            "given_name": "Test",
            "family_name": "User",
            "accepted_legal_version": "v1",
            "nickname": "Test",
            "gender": "Other",
            "picture": "None"
        });
    
    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
  it('should be protected "get created scope group"', async () => {
    // Do API call
    const res = await agent
      .get("/scopegroup/" + scope_group_id)
      .set('Authorization', 'Bearer ' + modifiedToken);
    
    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
  it('should be protected "put scope group"', async () => {
    // Do API Call
    const res = await agent.put("/scopegroup")
        .set('Authorization', 'Bearer ' + modifiedToken)
        .send(scope_group);

    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
it('should be protected "delete scope"', async () => {
  // Do API Call
  const res = await agent.delete("/scopegroup/" + scope_group_id)
      .set('Authorization', 'Bearer ' + modifiedToken)
      .send(scope_group);
    
  // Expect result contain      
  expect(res.statusCode).toEqual(401)
}, 500000);

}

