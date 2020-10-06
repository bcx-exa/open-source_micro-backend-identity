import { Controller, Put, Path, Get, Delete, Body, Route, Post, Tags, Security, Query } from "tsoa";
import { SuccessResponse } from '../types/response_types';
import { ScopesService } from "../services/scopes";
import { ScopeRequest } from "../types/scopes";

@Route("scope") // route name => localhost:xxx/SignUp
@Tags("Scopes") // => Under SignUpController tag
export class ScopeController extends Controller {
  @Get("{scope_id}") //specify the request type
  @Security('jwt', ['identity:scopes:get:admin'])
  async GetScope(@Path() scope_id: string, @Query() detailed = false ): Promise<any> {
    const data = await new ScopesService().getScope(scope_id, detailed);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Scope Controller - Get Scope",
      message: "Success",
      data: data
    };

    return result;
  }


  @Get() //specify the request type
  @Security('jwt', ['identity:scopes:get_all:admin'])
  async GetScopes(@Query() detailed = false): Promise<any> {
    const data = await new ScopesService().getScopes(detailed);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Scope Controller - Get Scopes",
      message: "Success",
      data: data
    };

    return result;
  }


  @Post() //specify the request type
  @Security('jwt', ['identity:scopes:post:admin'])
  async PostScope(@Body() body: ScopeRequest): Promise<any> {
    const data = await new ScopesService().createScope(body);
    
    const result: SuccessResponse = {
      statusCode: 201,
      name: "Scope Controller - Post Scope",
      message: "Success",
      data: data
    };

    return result;
  }


  @Put() //specify the request type
  @Security('jwt', ['identity:scopes:put:admin'])
  async PutScope(@Body() body: ScopeRequest): Promise<any> {
    const data = await new ScopesService().updateScope(body);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Scope Controller - Put Scope",
      message: "Success",
      data: data
    };

    return result;
  }


  @Delete("{scope_id}") //specify the request type
  @Security('jwt', ['identity:scopes:delete:admin'])
  async DeleteScope(@Path() scope_id: string, @Query() softDelete = true): Promise<any> {
    const data = await new ScopesService().deleteScope(scope_id, softDelete);
    
    const result: SuccessResponse = {
      statusCode: 200,
      name: "Scope Controller - Delete Scope",
      message: "Success",
      data: data
    };

    return result;
  }


  @Post("default_scopes") //specify the request type
  @Security('jwt', ['identity:scopes:post:admin'])
  async addDefaultScope(): Promise<any> {
    return new ScopesService().defaultIdentityScope();
  }
}
