import { Controller, Put, Path, Get, Delete, Body, Route, Post, Tags, Security, Query } from "tsoa";
import { SuccessResponse } from '../types/response_types';
import { UserGroupService } from "../services/user-group";
import { UserGroupRequest } from "../types/user-groups";

@Route("usergroup") // route name => localhost:xxx/SignUp
@Tags("User Groups") // => Under SignUpController tag
export class UserGroupController extends Controller {
  @Get("{user_group_id}") //specify the request type
  // @Security('jwt')
  async GetUserGroup(@Path() user_group_id: string, @Query() detailed = false): Promise<any> {
    const data = await new UserGroupService().getUserGroup(user_group_id, detailed);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "User Group Controller - Get User Group",
      message: "Success",
      data: data
    };

    return result;
  }

  @Get() //specify the request type
  // @Security('jwt')
  async GetUserGroups(@Query() detailed = false): Promise<any> {
    const data = await new UserGroupService().getUserGroups(detailed);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "User Group Controller - Get User Groups",
      message: "Success",
      data: data
    };

    return result;
  }

  @Post() //specify the request type
  // @Security('jwt')
  async PostUserGroups(@Body() body: UserGroupRequest): Promise<any> {
    const data = await new UserGroupService().createUserGroup(body);
    
    const result: SuccessResponse = {
      statusCode: 201,
      name: "User Group Controller - Post User Group",
      message: "Success",
      data: data
    };

    return result;
  }

  @Put() //specify the request type
  // @Security('jwt')
  async PutUserGroups(@Body() body: UserGroupRequest): Promise<any> {
    const data = await new UserGroupService().updateUserGroup(body);
    
    const result: SuccessResponse = {
      statusCode: 201,
      name: "User Group Controller - Put User Group",
      message: "Success",
      data: data
    };

    return result;
  }

  @Delete("{user_group_id}") //specify the request type
  // @Security('jwt')
  async DeleteUserGroup(@Path() user_group_id: string, @Query() softDelete = true): Promise<any> {
    const data = await new UserGroupService().deleteUserGroup(user_group_id, softDelete);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "User Group Controller - Delete User Group",
      message: "Success",
      data: data
    };

    return result;
  }
}
