import { Controller, Response, SuccessResponse, Get, Body, Route, Post, Tags, Security, Request } from "tsoa";
import { AuthenticationService } from "../services/authentication";
import { SignUp, SignIn } from "../types/authentication";
import { InternalServerError } from "../helpers/handlers/error-handling";

@Route("auth") // route name => localhost:xxx/SignUp
@Tags("Authentication") // => Under SignUpController tag
export class AuthenticationController extends Controller {
  @Response<InternalServerError>("Signup API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post("signup") //specify the request type
  async SignUpPost(@Body() signUp: SignUp): Promise<any> {
    return new AuthenticationService().SignUp(signUp);
  }

  @Response<InternalServerError>("Signin API Internal Server Error")
  @SuccessResponse("200", "User Logged In!") // Custom success response
  @Post("signin")
  async SignInPost(@Body() signIn: SignIn): Promise<any> {
    return new AuthenticationService().SignIn(signIn);
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
