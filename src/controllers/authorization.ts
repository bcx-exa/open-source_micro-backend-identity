import { Controller, Response, SuccessResponse, Get, Body, Route, Post, Tags, Security, Request } from "tsoa";
import { AuthenticationService } from "../services/authentication";
import { SignUp, SignIn } from "../types/authentication";
import { InternalServerError } from "../helpers/handlers/error-handling";

@Route("authz") // route name => localhost:xxx/SignUp
@Tags("Authorization") // => Under SignUpController tag
export class AuthorizationController extends Controller {
  @Response<InternalServerError>("Signup API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post("groups") //specify the request type
  @Security('jwt')
  async GroupsPost(@Body() signUp: SignUp): Promise<any> {
    return new AuthenticationService().SignUp(signUp);
  }

  @Response<InternalServerError>("Signup API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post("scopes") //specify the request type
  @Security('jwt')
  async ScopePost(@Body() signUp: SignUp): Promise<any> {
    return new AuthenticationService().SignUp(signUp);
  }

}
