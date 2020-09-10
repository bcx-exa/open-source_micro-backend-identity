import { Controller, Response, SuccessResponse, Path, Get, Delete, Body, Route, Post, Tags, Security } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";
import { ScopeGroupService } from "../services/scope-group";
import { ScopeGroupRequest } from "../types/scope-group";

@Route("scopegroup") // route name => localhost:xxx/SignUp
@Tags("Scope Groups") // => Under SignUpController tag
export class ScopeGroupController extends Controller {
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get("{scope_group_id}") //specify the request type
  // @Security('jwt')
  async GetScopeGroup(@Path() scope_group_id: string ): Promise<any> {
    return new ScopeGroupService().getScopeGroup(scope_group_id);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get() //specify the request type
  // @Security('jwt')
  async GetScopeGroups(): Promise<any> {
    return new ScopeGroupService().getScopeGroups();
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post() //specify the request type
  // @Security('jwt')
  async PostScopeGroups(@Body() body: ScopeGroupRequest): Promise<any> {
    return new ScopeGroupService().createScopeGroup(body);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Delete("{scope_group_id}") //specify the request type
  // @Security('jwt')
  async DeleteUserGroup(@Path() scope_group_id: string): Promise<any> {
    return new ScopeGroupService().deleteScopeGroup(scope_group_id);
  }
}
