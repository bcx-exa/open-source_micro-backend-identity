import { Controller, Response, SuccessResponse, Get, Delete, Body, Route, Post, Tags, Security, Request } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";

@Route("authz") // route name => localhost:xxx/SignUp
@Tags("Authorization") // => Under SignUpController tag
export class AuthorizationController extends Controller {
  @Response<InternalServerError>("Signup API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get("user") //specify the request type
  @Security('jwt')
  async GetUser(): Promise<any> {
    return;
  }
}
