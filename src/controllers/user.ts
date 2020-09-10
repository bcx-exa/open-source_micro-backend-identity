import { Controller, Response, SuccessResponse, Path, Put, Get, Delete, Body, Route, Post, Tags, Security } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";
import { UserService } from "../services/user";
import { UserRequest } from "../types/user";

@Route("user") // route name => localhost:xxx/SignUp
@Tags("User") // => Under SignUpController tag
export class UserController extends Controller {
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get("{user_id}") //specify the request type
  // @Security('jwt')
  async GetUser(@Path() user_id: string ): Promise<any> {
    return new UserService().getUser(user_id);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get() //specify the request type
  // @Security('jwt')
  async GetUsers(): Promise<any> {
    return new UserService().getUsers();
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
    return new UserService().createUser(body);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Delete("{user_id}") //specify the request type
  // @Security('jwt')
  async DeleteUsers(@Path() user_id: string): Promise<any> {
    return new UserService().deleteUser(user_id);
  }
}
