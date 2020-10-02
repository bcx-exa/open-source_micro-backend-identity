import { Controller, Response, SuccessResponse, Put, Path, Get, Delete, Body, Route, Post, Tags, Security, Query } from "tsoa";
import { InternalServerError } from '../types/response_types';
import { ScopeGroupService } from "../services/scope-group";
import { ScopeGroupRequest } from "../types/scope-group";

@Route("scopegroup") // route name => localhost:xxx/SignUp
@Tags("Scope Groups") // => Under SignUpController tag
export class ScopeGroupController extends Controller {
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get("{scope_group_id}") //specify the request type
  // @Security('jwt')
  async GetScopeGroup(@Path() scope_group_id: string, @Query() detailed = false ): Promise<any> {
    return new ScopeGroupService().getScopeGroup(scope_group_id, detailed);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get() //specify the request type
  // @Security('jwt')
  async GetScopeGroups(@Query() detailed = false): Promise<any> {
    return new ScopeGroupService().getScopeGroups(detailed);
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
  @Put() //specify the request type
  // @Security('jwt')
  async PutScopeGroups(@Body() body: ScopeGroupRequest): Promise<any> {
    return new ScopeGroupService().updateScopeGroup(body);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Delete("{scope_group_id}") //specify the request type
  // @Security('jwt')
  async DeleteUserGroup(@Path() scope_group_id: string, @Query() softDelete = true): Promise<any> {
    return new ScopeGroupService().deleteScopeGroup(scope_group_id, softDelete);
  }
}
