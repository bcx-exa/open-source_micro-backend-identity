import { agent, token } from "../setup";

export function ClientSecurity(client_id, client) {
  const modifiedToken = token + 'acd';

  it('should be protected "get clients"', async () => {
    // Do API call
    const res = await agent
      .get("/client")
      .set('Authorization', 'Bearer ' + modifiedToken);

    // Expect result contain
    expect(res.statusCode).toEqual(401);
  });
  it('should be protected "post client"', async () => {
    // Do API call
    const res = await agent
      .post("/client")
      .set('Authorization', 'Bearer ' + modifiedToken)
      .send({
        "client_name": "test",
        "client_secret": "ZXCVQWER1234!@#$123!!#$%adas123frfwer",
        "trusted": true,
        "redirect_uris": [
          "string"
        ]
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
  it('should be protected "get created client"', async () => {
    // Do API call
    const res = await agent
      .get("/client/" + client_id)
      .set('Authorization', 'Bearer ' + modifiedToken);
    
    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
  it('should be protected "put client"', async () => {
    // Do API Call
    const res = await agent.put("/client")
        .set('Authorization', 'Bearer ' + modifiedToken)
        .send(client);

    // Expect result contain
    expect(res.statusCode).toEqual(401);
  }, 500000);
it('should be protected "delete client"', async () => {
  // Do API Call
  const res = await agent.delete("/client/" + client_id)
      .set('Authorization', 'Bearer ' + modifiedToken)
      .send(client);
    
  // Expect result contain      
  expect(res.statusCode).toEqual(401)
}, 500000);

}

