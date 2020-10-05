import { Controller, Response, Get, Body, Route, Post, Tags } from "tsoa";
import { AuthenticationService } from "../services/authentication";
import { SignUp, SignIn } from "../types/authentication";
import { InternalServerError, SuccessResponse } from '../types/response_types';

@Route("auth") // route name => localhost:xxx/SignUp
@Tags("Authentication") // => Under SignUpController tag
export class AuthenticationController extends Controller {
  @Post("signup") //specify the request type
  async SignUpPost(@Body() signUp: SignUp): Promise<any> {

    const data = await new AuthenticationService().SignUp(signUp);

    const result: SuccessResponse = {
      statusCode: 201,
      name: "Authentication Controller - Sign Up",
      message: "Success: Please verify your account!",
      data: data
    };

    return result;
  }

 
  @Get("login")
  async LoginGet(): Promise<any> {
    return;
  }


  @Post("login")
  async LoginPost(@Body() _signIn: SignIn): Promise<any> {
    return;
  }

  @Get("logout")
  async LogoutGet(): Promise<any> {
    return;
  }

  @Post("logout")
  async LogoutPost(@Body() _signIn: SignIn): Promise<any> {
    return;
  }

  @Get("google")
  async SignInGoogle(): Promise<any> {
    return;
  }

  @Get("facebook")
  async SignInFacebook(): Promise<any> {
    return;
  }
}
