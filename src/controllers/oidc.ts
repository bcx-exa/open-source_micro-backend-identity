import express from 'express';
import { Controller, Get, Request, Response, SuccessResponse, Route, Post, Tags } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";

@Route("oidc") // route name => localhost:xxx/SignUp
@Tags("OIDC") // => Under SignUpController tag
export class OidcController extends Controller {
  
  @Response<InternalServerError>("Verification Message API Internal Server Error")
  @SuccessResponse("200", "Verification Message Resent!") // Custom success response
  @Get("auth")
  async Auth(@Request() request: any): Promise<any> {
    const response = (<any>request).res as express.Response;
    response.redirect('oidc/auth');
  }
  @Response<InternalServerError>("Verification Message API Internal Server Error")
  @SuccessResponse("200", "Verification Message Resent!") // Custom success response
  @Post("device/auth")
  async DeviceAuth(): Promise<any> {
    return;
  }

  @Response<InternalServerError>("Verification Message API Internal Server Error")
  @SuccessResponse("200", "Verification Message Resent!") // Custom success response
  @Post("session/end")
  async SessionEnd(): Promise<any> {
    return;
  }
  @Response<InternalServerError>("Verification Message API Internal Server Error")
  @SuccessResponse("200", "Verification Message Resent!") // Custom success response
  @Post("jwks")
  async Jwks(): Promise<any> {
    return;
  }

  @Response<InternalServerError>("Verification Message API Internal Server Error")
  @SuccessResponse("200", "Verification Message Resent!") // Custom success response
  @Post("token")
  async Token(): Promise<any> {
    return;
  }

  @Response<InternalServerError>("Verification Message API Internal Server Error")
  @SuccessResponse("200", "Verification Message Resent!") // Custom success response
  @Post("me")
  async Me(): Promise<any> {
    return;
  }

  @Response<InternalServerError>("Verification Message API Internal Server Error")
  @SuccessResponse("200", "Verification Message Resent!") // Custom success response
  @Post("introspection")
  async Introspection(): Promise<any> {
    return;
  }

  @Response<InternalServerError>("Verification Message API Internal Server Error")
  @SuccessResponse("200", "Verification Message Resent!") // Custom success response
  @Post("token/revocation")
  async TokenRevocation(): Promise<any> {
    return;
  }


  
}