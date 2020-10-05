import { Example, Controller, Response, SuccessResponse, Path, Put, Get, Delete, Body, Route, Post, Tags, Security, Query } from "tsoa";
import { InternalServerError, SuccessResponse as sr } from '../types/response_types';
import { UserService } from "../services/user";
import { UserRequest } from "../types/user";

@Route("user") // route name => localhost:xxx/SignUp
@Tags("User") // => Under SignUpController tag

export class UserController extends Controller {
  @Example<sr>({ statusCode: 200, name: "Controller Name - API Name", message: "Success or Error Message", data: ["Requested Info or Stack Trace"] })
  @Get("{user_id}") //specify the request type
  @Security('jwt',['identity:user:get:admin'])
  async GetUser(@Query() detailed = false, @Path() user_id: string ): Promise<any> {
    
    const data = await new UserService().getUser(user_id, detailed);
    
    return {
      statusCode: 200, 
      name: "User Controller - Get User",
      message: "Success",
      data: data
    };
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get() //specify the request type
  // @Security('jwt')
  async GetUsers(@Query() detailed = false): Promise<any> {

    const data = await new UserService().getUsers(detailed);
    
    return {
      statusCode: 200, 
      name: "User Controller - Get Users",
      message: "Success",
      data: data
    };
  }

  @Get("scopes/{user_id}") //specify the request type
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
