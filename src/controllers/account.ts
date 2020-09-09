import { Controller, Query, Request, Response, SuccessResponse, Get, Body, Route, Post, Tags, Security } from "tsoa";
import { AccountService } from "../services/account";
import { UserProfileUpdate, VerifyResend, PasswordResetRequest, PasswordReset } from "../types/account";
import { InternalServerError } from "../components/handlers/error-handling";

@Route("account") // route name => localhost:xxx/SignUp
@Tags("Account") // => Under SignUpController tag
export class AccountController extends Controller {
  
  // Get user profile from JWT
  @Response<InternalServerError>("Profile API Internal Server Error")
  @SuccessResponse("200", "Account Verified!") // Custom success response
  @Post("profile")
  @Security('jwt')
  async ProfilePost(@Body() profile: UserProfileUpdate, @Request() req: any ): Promise<any> {
    return new AccountService().ProfileUpdate(profile, req);
  }

  @Response<InternalServerError>("Verification Message API Internal Server Error")
  @SuccessResponse("200", "Verification Message Resent!") // Custom success response
  @Post("verify/resend")
  async VerifyResend(@Body() username: VerifyResend): Promise<any> {
    return new AccountService().VerifyResend(username);
  }

  @Response<InternalServerError>("Verify API Internal Server Error")
  @SuccessResponse("200", "Account Verified!") // Custom success response
  @Get("verify")
  @Security('jwt-query')
  async VerifyGet(@Query() token: string, @Request() req: any): Promise<any> {
    return new AccountService().VerifyAccount(token, req);
  }

  @Response<InternalServerError>("Verify API Internal Server Error")
  @SuccessResponse("200", "Account Verified!") // Custom success response
  @Post("password/reset/request")
  async PasswordRequestPost(@Body() body: PasswordResetRequest): Promise<any> {
    return new AccountService().PasswordResetRequest(body);
  }
  @Response<InternalServerError>("Verify API Internal Server Error")
  @SuccessResponse("200", "Account Verified!") // Custom success response
  @Post("password/reset")
  @Security('jwt-query')
  async PasswordResetPost(@Query() token: string, @Body() body: PasswordReset, @Request() req): Promise<any> {
    return new AccountService().PasswordReset(token, body, req);
  }
}