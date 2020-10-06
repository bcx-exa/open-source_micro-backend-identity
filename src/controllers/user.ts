import { Controller, Path, Put, Get, Delete, Body, Route, Post, Tags, Security, Query } from "tsoa";
import { SuccessResponse } from '../types/response_types';
import { UserService } from "../services/user";
import { UserRequest } from "../types/user";

@Route("user") // route name => localhost:xxx/SignUp
@Tags("User") // => Under SignUpController tag

export class UserController extends Controller {
  @Get("{user_id}") //specify the request type
  @Security('jwt', ['identity:user:get:admin'])
  async GetUser(@Query() detailed = false, @Path() user_id: string ): Promise<any> {   
    const data = await new UserService().getUser(user_id, detailed);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "User Controller - Get User",
      message: "Success",
      data: data
    };

    return result;
  }

  @Get() //specify the request type
  @Security('jwt', ['identity:user:get_all:admin'])
  async GetUsers(@Query() detailed = false): Promise<any> {

    const data = await new UserService().getUsers(detailed);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "User Controller - Get Users",
      message: "Success",
      data: data
    };

    return result;
  }

  @Get("scopes/{user_id}") //specify the request type
  @Security('jwt', ['identity:scopes:get:admin'])
  async GetUserScopes(@Path() user_id: string): Promise<any> {   
    const data = await  new UserService().getUserScopes(user_id);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "User Controller - Get User Scopes",
      message: "Success",
      data: data
    };

    return result;
  }

  @Post() //specify the request type
  @Security('jwt', ['identity:scopes:post:admin'])
  async PostUsers(@Body() body: UserRequest): Promise<any> {
    const data = await new UserService().createUser(body);
    
    const result: SuccessResponse = {
      statusCode: 201,
      name: "User Controller - Post User",
      message: "Success",
      data: data
    };

    return result;
  }

  @Put() //specify the request type
  @Security('jwt', ['identity:scopes:put:admin'])
  async PutUsers(@Body() body: UserRequest): Promise<any> {
    const data = await new UserService().updateUser(body);
    
    const result: SuccessResponse = {
      statusCode: 201,
      name: "User Controller - Put User",
      message: "Success",
      data: data
    };

    return result;
  }

  @Delete("{user_id}") //specify the request type
  @Security('jwt', ['identity:scopes:delete:admin'])
  async DeleteUsers(@Path() user_id: string, @Query() softDelete = true): Promise<any> {
    const data = await new UserService().deleteUser(user_id, softDelete);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "User Controller - Delete User",
      message: "Success",
      data: data
    };

    return result;
  }
}

