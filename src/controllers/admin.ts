import { Controller, Request, Response, SuccessResponse, Put, Path, Get, Delete, Body, Route, Post, Tags, Security, Query, Res } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";
import { AdminService } from "../services/admin";

@Route("admin") // route name => localhost:xxx/SignUp
@Tags("Admin") // => Under SignUpController tag
export class AdminController extends Controller {
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post("initial_scope_creation") //specify the request type
  // @Security('jwt')
  async addDefaultSchema(): Promise<any> {
    return new AdminService().defaultSchema();
  }
}
