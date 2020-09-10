import { Controller, Path, Response, SuccessResponse, Delete, Get, Body, Post, Route, Tags, Query } from "tsoa";
import { InternalServerError } from "../components/handlers/error-handling";
import { ClientService } from "../services/client";

@Route("client") // route name => localhost:xxx/SignUp
@Tags("OAuth Clients") // => Under SignUpController tag
export class ClientController extends Controller {   
    @Response<InternalServerError>("Oauth Client API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Get("{clientName}") //specify the request type
    //@Security('jwt')
    async GetClient(@Path() clientName: string): Promise<any> {
        return new ClientService().getOauthClients(clientName); 
    }
    
    @Response<InternalServerError>("Oauth Client API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Get() //specify the request type
    //@Security('jwt')
    async GetAllClients(): Promise<any> {
        return new ClientService().getAllOauthClients(); 
    }
    
    @Response<InternalServerError>("Oauth Client API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Post() //specify the request type
    //@Security('jwt')
    async CreateOrUpdateOauthClient(@Body() body: {clientName: string, clientSecret: string}): Promise<any> {
        return new ClientService().createOrUpdateOauthClient(body); 
    }

    @Response<InternalServerError>("Oauth Client API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Delete("{clientName}") //specify the request type
    //@Security('jwt')
    async DeleteClient(@Path() clientName: string): Promise<any> {
        return new ClientService().deleteOauthClients(clientName); 
    }
}
