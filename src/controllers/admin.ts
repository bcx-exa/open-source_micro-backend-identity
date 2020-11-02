import { auroraConnectApi } from "../components/database/connection";
import { Controller, Get, Security, Route, Post, Tags } from "tsoa";
import { AdminService } from "../services/admin";
import { Oauth } from "../models/oauth";

@Route("admin") // route name => localhost:xxx/SignUp
@Tags("Admin") // => Under SignUpController tag
export class AdminController extends Controller {
  @Post("initial_scope_creation") //specify the request type
  // @Security('jwt')
  async addDefaultSchema(): Promise<any> {
    return new AdminService().defaultSchema();
  }
  @Get("truncate_oauth_table") //specify the request type
  @Security('jwt')
  async deleteOauthSessions(): Promise<any> {
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Oauth);
    return await repository.clear({ cascade: true });
  }
}



