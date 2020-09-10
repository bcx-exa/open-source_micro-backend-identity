import { Controller, Response, SuccessResponse, Path, Get, Delete, Body, Route, Post, Tags, Security } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";
import { ScopesService } from "../services/scopes";
import { ScopeRequest } from "../types/scopes";

@Route("scope") // route name => localhost:xxx/SignUp
@Tags("Scopes") // => Under SignUpController tag
export class ScopeController extends Controller {
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get("{scope_id}") //specify the request type
  // @Security('jwt')
  async GetScope(@Path() scope_id: string ): Promise<any> {
    return new ScopesService().getScope(scope_id);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get() //specify the request type
  // @Security('jwt')
  async GetScopes(): Promise<any> {
    return new ScopesService().getScopes();
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post() //specify the request type
  // @Security('jwt')
  async PostScope(@Body() body: ScopeRequest): Promise<any> {
    return new ScopesService().createScope(body);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Delete("{scope_id}") //specify the request type
  // @Security('jwt')
  async DeleteScope(@Path() scope_id: string): Promise<any> {
    return new ScopesService().deleteScope(scope_id);
  }
}
