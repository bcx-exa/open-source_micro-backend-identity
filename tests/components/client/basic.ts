import { agent, token } from "../setup";
export let client, client_id;

export function ClientBasic() {
  it('should get all clients', async () => {
    // Do API call
    const res = await agent
      .get("/client")
      .set('Authorization', 'Bearer ' + token);

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
  });
  it('should create a client', async () => {
    // Do API call
    const res = await agent
      .post("/client")
      .set('Authorization', 'Bearer ' + token)
      .send({
        "client_name": "test",
        "client_secret": "ZXCVQWER1234!@#$123!!#$%adas123frfwer",
        "trusted": true,
        "redirect_uris": [
          "string"
        ]
      });
    
    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');

    // Asign Global Variable to be used in other tests
    client_id = res.body.data.client_id;
  }, 500000);
  it('should get created client', async () => {
    // Do API call
    const res = await agent
      .get("/client/" + client_id)
      .set('Authorization', 'Bearer ' + token);
    
    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
    expect(res.body.data.client_id).toEqual(client_id);

    // Asign Global Variable to be used in other tests
    client = res.body.data;
  }, 500000);
  it('should modify a client', async () => {
    // Remove nulls and modify global user
    const clientModified = 
    {
      "client_id": client_id,
      "client_name": "Client Modified",
      "client_secret": "ZXCVQWER1234!@#$123!!#$%adas123frfwer",
      "trusted": true,
      "redirect_uris": [
        "string"
      ]
    }

    // Do API Call
    const res = await agent.put("/client")
        .set('Authorization', 'Bearer ' + token)
        .send(clientModified);

    // Expect result contain
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Success');
    expect(res.body.data.client_name).toEqual("Client Modified");
  }, 500000);
it('should delete the created client', async () => {
  // Do API Call
  const res = await agent.delete("/client/" + client_id)
      .set('Authorization', 'Bearer ' + token)
      .send(client);
    
  // Expect result contain      
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('message')
  expect(res.body.message).toEqual('Success')
}, 500000);

}

