import { Controller, Route, Post, Tags } from "tsoa";
import { AdminService } from "../services/admin";

@Route("admin") // route name => localhost:xxx/SignUp
@Tags("Admin") // => Under SignUpController tag
export class AdminController extends Controller {
  @Post("initial_scope_creation") //specify the request type
  // @Security('jwt')
  async addDefaultSchema(): Promise<any> {
    return new AdminService().defaultSchema();
  }
}



