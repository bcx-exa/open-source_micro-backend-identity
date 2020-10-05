import { Controller, Query, Request, Get, Body, Route, Post, Tags, Security } from "tsoa";
import { AccountService } from "../services/account";
import { VerifyResend, PasswordResetRequest, PasswordReset } from "../types/account";
import { SuccessResponse } from '../types/response_types';

@Route("account") // route name => localhost:xxx/SignUp
@Tags("Account") // => Under SignUpController tag
export class AccountController extends Controller {

  @Post("verify_resend")
  async VerifyResend(@Body() username: VerifyResend): Promise<any> {
    const data = await new AccountService().VerifyResend(username);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Account Controller - Resend Verification Message",
      message: "Success",
      data: data
    };

    return result;
  }

  @Get("verify")
  @Security('jwt-query')
  async VerifyGet(@Query() token: string, @Request() req: any): Promise<any> {
    const data = await  new AccountService().VerifyAccount(token, req);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Account Controller - Verify Account",
      message: "Success",
      data: data
    };

    return result;
  }

  @Post("password_reset_request")
  async PasswordRequestPost(@Body() body: PasswordResetRequest, @Request() req: any): Promise<any> {
    const data = await new AccountService().PasswordResetRequest(body, req);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Account Controller - Request Password Reset",
      message: "Success",
      data: data
    };

    return result;
  }

  @Post("password_reset")
  @Security('jwt-query')
  async PasswordResetPost(@Query() token: string, @Body() body: PasswordReset, @Request() req): Promise<any> {
    const data = await new AccountService().PasswordReset(token, body, req);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Account Controller - Password Reset",
      message: "Success",
      data: data
    };

    return result;
  }
}