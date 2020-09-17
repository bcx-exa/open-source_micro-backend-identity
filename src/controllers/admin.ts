import { Controller, Request, Response, SuccessResponse, Put, Path, Get, Delete, Body, Route, Post, Tags, Security, Query, Res } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";
import { AdminService } from "../services/admin";

@Route("admin") // route name => localhost:xxx/SignUp
@Tags("Admin") // => Under SignUpController tag
export class AdminController extends Controller {
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("302", "Redirect") // Custom success response
  @Get("rest_redirect") //specify the request type
  // @Security('jwt')
  async testRedirect(@Request() request): Promise<any> {
    const response = (<any>request).res;
    response.redirect('http://localhost:5000/user');
  }
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post("default_schema") //specify the request type
  // @Security('jwt')
  async addDefaultSchema(): Promise<any> {
    return new AdminService().defaultSchema();
  }
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get("authz") //specify the request type
  // @Security('jwt')
  async testAuthz(@Request() req): Promise<any> {
    return {
      req: req.headers
    };
  }
}
