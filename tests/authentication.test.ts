import { AuthenticationService } from '../src/services/authentication';
import { SignUp } from '../src/types/authentication';


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
