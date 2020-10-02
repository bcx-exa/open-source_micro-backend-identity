import { Controller, Response, SuccessResponse, Put, Path, Get, Delete, Body, Route, Post, Tags, Security, Query } from "tsoa";
import { InternalServerError } from '../types/response_types';
import { ScopesService } from "../services/scopes";
import { ScopeRequest } from "../types/scopes";

@Route("scope") // route name => localhost:xxx/SignUp
@Tags("Scopes") // => Under SignUpController tag
export class ScopeController extends Controller {
  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get("{scope_id}") //specify the request type
  // @Security('jwt')
  async GetScope(@Path() scope_id: string, @Query() detailed = false ): Promise<any> {
    return new ScopesService().getScope(scope_id, detailed);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Get() //specify the request type
  // @Security('jwt')
  async GetScopes(@Query() detailed = false): Promise<any> {
    return new ScopesService().getScopes(detailed);
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
  @Put() //specify the request type
  // @Security('jwt')
  async PutScope(@Body() body: ScopeRequest): Promise<any> {
    return new ScopesService().updateScope(body);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Delete("{scope_id}") //specify the request type
  // @Security('jwt')
  async DeleteScope(@Path() scope_id: string, @Query() softDelete = true): Promise<any> {
    return new ScopesService().deleteScope(scope_id, softDelete);
  }

  @Response<InternalServerError>("User API Internal Server Error")
  @SuccessResponse("201", "Created") // Custom success response
  @Post("default_scopes") //specify the request type
  // @Security('jwt')
  async addDefaultScope(): Promise<any> {
    return new ScopesService().defaultIdentityScope();
  }
}
