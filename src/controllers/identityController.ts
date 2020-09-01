import { Controller, Query, Response, SuccessResponse, Get, Body, Route, Post, Tags, Security, Request } from "tsoa";
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
  @Security('jwt-verify')
  async VerifyGet(@Query() token: string, @Request() req: any): Promise<any> {
    return new IdentityService().VerifyAccount(token, req);
  }

  @Response<InternalServerError>("Profile API Internal Server Error")
  @SuccessResponse("200", "Account Verified!") // Custom success response
  @Post("profile")
  @Security('jwt')
  async ProfilePost(@Body() profile: SignUp): Promise<any> {
    return profile;
  }

  @Response<InternalServerError>("Password Reset API Internal Server Error")
  @SuccessResponse("200", "Account Verified!") // Custom success response
  @Post("passwordreset")
  @Security('jwt')
  async PasswordResetPost(@Body() profile: SignUp): Promise<any> {
    return profile;
  }

  @Get("google")
  @Security("google", ["profile"])
  async SignInGooglePost(): Promise<any> {
    return;
  }

  @Get("google/callback")
  @Security("google_callback")
  async SignInGoolgeCallbackPost(): Promise<any> {
    return;
  }
}