import { Controller, Response, SuccessResponse, Get, Delete, Body, Route, Post, Tags, Security, Request } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";
import { AdminService } from "../services/admin";
import { UserGroupRequest } from "../types/admin";

@Route("admin") // route name => localhost:xxx/SignUp
@Tags("Admin") // => Under SignUpController tag
export class AdminController extends Controller {
  @Response<InternalServerError>("UserGroup API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post("usergroup") //specify the request type
  // @Security('jwt')
  async CreateOrUpdateUserGroup(@Body() body: UserGroupRequest ): Promise<any> {
    return new AdminService().createUserGroup(body);
  }
}
