import { Controller, Query, Request, Response, SuccessResponse, Get, Body, Route, Post, Tags, Security } from "tsoa";
import { AccountService } from "../services/account";
import { VerifyResend, PasswordResetRequest, PasswordReset } from "../types/account";
import { InternalServerError } from '../types/response_types';

@Route("account") // route name => localhost:xxx/SignUp
@Tags("Account") // => Under SignUpController tag
export class AccountController extends Controller {

  @Response<InternalServerError>("Verification Message API Internal Server Error")
  @SuccessResponse("200", "Verification Message Resent!") // Custom success response
  @Post("verify_resend")
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
  @Post("password_reset_request")
  async PasswordRequestPost(@Body() body: PasswordResetRequest, @Request() req: any): Promise<any> {
    return new AccountService().PasswordResetRequest(body, req);
  }
  @Response<InternalServerError>("Verify API Internal Server Error")
  @SuccessResponse("200", "Account Verified!") // Custom success response
  @Post("password_reset")
  @Security('jwt-query')
  async PasswordResetPost(@Query() token: string, @Body() body: PasswordReset, @Request() req): Promise<any> {
    return new AccountService().PasswordReset(token, body, req);
  }
}