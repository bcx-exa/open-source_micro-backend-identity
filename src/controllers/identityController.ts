import { Controller, Query, Response, SuccessResponse, Get, Body, Route, Post, Tags, Security } from "tsoa";
import { IdentityService } from "../services/identity";
import { SignUp, SignIn } from "../models/identity";
import { InternalServerError } from "../helpers/error-handling";

//@Response<IUserResponse>('200', 'Success')
@Route("auth") // route name => localhost:xxx/SignUp
@Tags("AuthController") // => Under SignUpController tag
export class AuthController extends Controller {
  @Response<InternalServerError>("Signup API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post("signup") //specify the request type
  async SignUpPost(@Body() SignUp: SignUp): Promise<any> {
    return new IdentityService().SignUp(SignUp);
  }
  @Response<InternalServerError>("Signin API Internal Server Error")
  @SuccessResponse("200", "User Logged In!") // Custom success response
  @Post("signin")
  async SignInPost(@Body() SignIn: SignIn): Promise<any> {
    return new IdentityService().SignIn(SignIn);
  }

  @Response<InternalServerError>("Verify API Internal Server Error")
  @SuccessResponse("200", "Account Verified!") // Custom success response
  @Get("verify")
  @Security("jwt-query")
  async VerifyGet(@Query() token: string): Promise<any> {
    return new IdentityService().VerifyAccount(token);
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
