import { Controller, Put, Path, Delete, Get, Body, Post, Route, Tags, Query } from "tsoa";
import { SuccessResponse } from '../types/response_types';
import { ClientService } from "../services/client";
import { ClientPost } from "../types/client";

@Route("client") // route name => localhost:xxx/SignUp
@Tags("Clients") // => Under SignUpController tag
export class ClientController extends Controller {   
    @Get("{client_id}") //specify the request type
    //@Security('jwt')
    async GetClient(@Path() client_id: string): Promise<any> {
        const data = await new ClientService().getClient(client_id); 
    
        const result: SuccessResponse = {
          statusCode: 200,
          name: "Client Controller - Get Client",
          message: "Success",
          data: data
        };
    
        return result;
    }
    
    @Get() //specify the request type
    //@Security('jwt')
    async GetClients(): Promise<any> {
        const data = await new ClientService().getClients(); 
    
        const result: SuccessResponse = {
          statusCode: 200,
          name: "Client Controller - Get Clients",
          message: "Success",
          data: data
        };
    
        return result;
    }
    
    @Post() //specify the request type
    //@Security('jwt')
    async CreateClient(@Body() body: ClientPost): Promise<any> {
        const data = await new ClientService().createClient(body); 
    
        const result: SuccessResponse = {
          statusCode: 201,
          name: "Client Controller - Post Client",
          message: "Success",
          data: data
        };
    
        return result;
    }

    @Put() //specify the request type
    //@Security('jwt')
    async UpdateClient(@Body() body: ClientPost ): Promise<any> {
        const data = await new ClientService().updateClient(body); 
    
        const result: SuccessResponse = {
          statusCode: 200,
          name: "Client Controller - Put Client",
          message: "Success",
          data: data
        };
    
        return result;
    }

    @Delete("{client_id}") //specify the request type
    //@Security('jwt')
    async DeleteClient(@Path() client_id: string, @Query() softDelete = true): Promise<any> {
        const data = await new ClientService().deleteClient(client_id, softDelete); 
    
        const result: SuccessResponse = {
          statusCode: 200,
          name: "Client Controller - Delete Client",
          message: "Success",
          data: data
        };
    
        return result;
    }
}
