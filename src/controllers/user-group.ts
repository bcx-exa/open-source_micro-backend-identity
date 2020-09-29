import { Controller, Response, SuccessResponse, Put, Path, Get, Delete, Body, Route, Post, Tags, Security, Query } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";
import { UserGroupService } from "../services/user-group";
import { UserGroupRequest } from "../types/user-groups";

@Route("usergroup") // route name => localhost:xxx/SignUp
@Tags("User Groups") // => Under SignUpController tag
export class UserGroupController extends Controller {
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get("{user_group_id}") //specify the request type
  // @Security('jwt')
  async GetUserGroup(@Path() user_group_id: string, @Query() detailed = false): Promise<any> {
    return new UserGroupService().getUserGroup(user_group_id, detailed);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get() //specify the request type
  // @Security('jwt')
  async GetUsers(@Query() detailed = false): Promise<any> {
    return new UserGroupService().getUserGroups(detailed);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post() //specify the request type
  // @Security('jwt')
  async PostUserGroups(@Body() body: UserGroupRequest): Promise<any> {
    return new UserGroupService().createUserGroup(body);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Put() //specify the request type
  // @Security('jwt')
  async PutUserGroups(@Body() body: UserGroupRequest): Promise<any> {
    return new UserGroupService().updateUserGroup(body);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Delete("{user_group_id}") //specify the request type
  // @Security('jwt')
  async DeleteUserGroup(@Path() user_group_id: string, @Query() softDelete = true): Promise<any> {
    return new UserGroupService().deleteUserGroup(user_group_id, softDelete);
  }
}
