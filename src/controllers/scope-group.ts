import { Controller, Put, Path, Get, Delete, Body, Route, Post, Tags, Security, Query } from "tsoa";
import { SuccessResponse } from '../types/response_types';
import { ScopeGroupService } from "../services/scope-group";
import { ScopeGroupRequest } from "../types/scope-group";

@Route("scopegroup") // route name => localhost:xxx/SignUp
@Tags("Scope Groups") // => Under SignUpController tag
export class ScopeGroupController extends Controller {
  @Get("{scope_group_id}") //specify the request type
  @Security('jwt', ['identity:scopegroups:get:admin'])
  async GetScopeGroup(@Path() scope_group_id: string, @Query() detailed = false ): Promise<any> {
    const data = await new ScopeGroupService().getScopeGroup(scope_group_id, detailed);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Scope Group Controller - Get Scope Group",
      message: "Success",
      data: data
    };

    return result;
  }

  @Get() //specify the request type
  @Security('jwt', ['identity:scopegroups:get_all:admin'])
  async GetScopeGroups(@Query() detailed = false): Promise<any> {
    const data = await new ScopeGroupService().getScopeGroups(detailed);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Scope Group Controller - Get Scope Groups",
      message: "Success",
      data: data
    };

    return result;
  }

  @Post() //specify the request type
  @Security('jwt', ['identity:scopegroups:post:admin'])
  async PostScopeGroup(@Body() body: ScopeGroupRequest): Promise<any> {
    const data = await new ScopeGroupService().createScopeGroup(body);
    
    const result: SuccessResponse = {
      statusCode: 201,
      name: "Scope Group Controller - Post Scope Group",
      message: "Success",
      data: data
    };

    return result;
  }

  @Put() //specify the request type
  @Security('jwt', ['identity:scopegroups:put:admin'])
  async PutScopeGroup(@Body() body: ScopeGroupRequest): Promise<any> {
    const data = await new ScopeGroupService().updateScopeGroup(body);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Scope Group Controller - Put Scope Group",
      message: "Success",
      data: data
    };

    return result;
  }

  @Delete("{scope_group_id}") //specify the request type
  @Security('jwt', ['identity:scopegroups:delete:admin'])
  async DeleteUserGroup(@Path() scope_group_id: string, @Query() softDelete = true): Promise<any> {
    const data = await  new ScopeGroupService().deleteScopeGroup(scope_group_id, softDelete);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Scope Group Controller - Delete Scope Group",
      message: "Success",
      data: data
    };

    return result;
  }
}
