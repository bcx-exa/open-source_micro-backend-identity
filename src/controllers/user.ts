import { Controller, Response, SuccessResponse, Path, Put, Get, Delete, Body, Route, Post, Tags, Security, Query } from "tsoa";
import { InternalServerError } from '../types/response_types';
import { UserService } from "../services/user";
import { UserRequest } from "../types/user";

@Route("user") // route name => localhost:xxx/SignUp
@Tags("User") // => Under SignUpController tag
export class UserController extends Controller {
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get("{user_id}") //specify the request type
  // @Security('jwt')
  async GetUser(@Query() detailed = false, @Path() user_id: string ): Promise<any> {
    return new UserService().getUser(user_id, detailed);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get() //specify the request type
  // @Security('jwt')
  async GetUsers(@Query() detailed = false): Promise<any> {
    return new UserService().getUsers(detailed);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get("scopes/{user_id}") //specify the request type
  // @Security('jwt')
  async GetUserScopes(@Path() user_id: string): Promise<any> {
    return new UserService().getUserScopes(user_id);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post() //specify the request type
  // @Security('jwt')
  async PostUsers(@Body() body: UserRequest): Promise<any> {
    return new UserService().createUser(body);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @Put() //specify the request type
  // @Security('jwt')
  async PutUsers(@Body() body: UserRequest): Promise<any> {
    return new UserService().updateUser(body);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Delete("{user_id}") //specify the request type
  // @Security('jwt')
  async DeleteUsers(@Path() user_id: string, @Query() softDelete = true): Promise<any> {
    return new UserService().deleteUser(user_id, softDelete);
  }
}
