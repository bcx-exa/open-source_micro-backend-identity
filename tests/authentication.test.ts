import { AuthenticationService } from '../src/services/authentication';
import { SignUp } from '../src/types/authentication';
import { Server } from '../src/server'
import request from "supertest";
const expressApp = new Server();
expressApp.Start();


describe("User Sign up", () => {
  test(`Password Policy Validation`, async () => {
    const res = await request(expressApp.app)
      .post('/auth/signup')
      .send({
        "preferred_username": "noPassword@gmail.com",
        "password": "123",
        "given_name": "foo",
        "family_name": "bar"
      })
    expect(res.statusCode).toEqual(406)
    expect(res.body).toHaveProperty('name')
  }, 30000);
  test(`Valid Signup`, async () => {
    const res = await request(expressApp.app)
      .post('/auth/signup')
      .send({
        "preferred_username": "test@gmail.com",
        "password": "Password@1",
        "given_name": "foo",
        "family_name": "bar"
      })
    expect(res.statusCode).toEqual(409)
  }, 30000);
})



test("Password Policy Validation", async () => {
  const signUp: SignUp = {
    preferred_username: 'test@gmail.com',
    password: '123',
    given_name: 'foo',
    family_name: 'bar'
  };
  expect.assertions(1);
  await expect(new AuthenticationService().SignUp(signUp)).rejects.toThrow(Error);
});

test("Username", async () => {
  const signUp: SignUp = {
    preferred_username: 'test123gmail.com',
    password: '123',
    given_name: 'foo',
    family_name: 'bar'
  };
  expect.assertions(1);
  await expect(new AuthenticationService().SignUp(signUp)).rejects.toThrow(Error);
});
