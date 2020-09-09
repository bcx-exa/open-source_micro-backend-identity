import { Controller, Response, SuccessResponse, Delete, Get, Body, Post, Route, Tags, Query } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";
import { ClientService } from "../services/client";

@Route("oauth") // route name => localhost:xxx/SignUp
@Tags("Oauth Admin") // => Under SignUpController tag
export class ClientController extends Controller {
    @Response<InternalServerError>("Oauth Client API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Post("client") //specify the request type
    //@Security('jwt')
    async CreateClient(@Body() body: {clientName: string, clientSecret: string}): Promise<any> {
        return new ClientService().creatOauthClient(body); 
    }
    
    @Response<InternalServerError>("Oauth Client API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Get("clients") //specify the request type
    //@Security('jwt')
    async GetAllClients(): Promise<any> {
        return new ClientService().getAllOauthClients(); 
    }

    @Response<InternalServerError>("Oauth Client API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Get("client") //specify the request type
    //@Security('jwt')
    async GetClient(@Query() clientName: string): Promise<any> {
        return new ClientService().getOauthClients(clientName); 
    }

    @Response<InternalServerError>("Oauth Client API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Delete("client") //specify the request type
    //@Security('jwt')
    async DeleteClient(@Body() body: {clientName: string}): Promise<any> {
        return new ClientService().deleteOauthClients(body); 
    }
}
