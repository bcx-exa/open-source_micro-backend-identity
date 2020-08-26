import { Controller, Body, Route, Post, Tags, Security } from 'tsoa';
import { IdentityService } from '../services/identity';
import { IdentitySignUp, IdentitySignIn } from '../models/identity';


//@Response<IUserResponse>('200', 'Success')
@Route('auth') // route name => localhost:xxx/SignUp
@Tags('AuthController') // => Under SignUpController tag    
export class AuthController extends Controller {    
  @Post('signup')  //specify the request type
  async SignUpPost( @Body() IdentitySignUp: IdentitySignUp ): Promise<any> {      
    return new IdentityService().SignUp(IdentitySignUp);
  }
  @Post('signin')  //specify the request type
  async SignInPost( @Body() IdentitySignIn: IdentitySignIn): Promise<any> {    
      return new IdentityService().SignIn(IdentitySignIn);
  }
  @Security("jwt")
  @Post('refresh')  //specify the request type
  async RefreshPost(): Promise<any> {    

    
    return 'You are authenticated';
  }
}


