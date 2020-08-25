import { Controller, Body, Route, Post, Tags, Security } from 'tsoa';
import { expressAuthentication } from '../middelware/passport/passport-jwt';
import { UserService } from '../services/users';
import { UserSignUp, UserSignIn } from '../models/user';


@Route('auth') // route name => localhost:xxx/SignUp
@Tags('AuthController') // => Under SignUpController tag    
export class AuthController extends Controller {    
  @Post('signup')  //specify the request type
  async SignUpPost( @Body() UserSignUp: UserSignUp): Promise<any> {      
      return new UserService().SignUp(UserSignUp);
  }
  @Post('signin')  //specify the request type
  async SignInPost( @Body() UserSignIn: UserSignIn): Promise<any> {    
      return new UserService().SignIn(UserSignIn);
  }
  @Security('JWT')
  @Post('refresh')  //specify the request type
  async RefreshPost(): Promise<any> {    
      return 'You are authenticated';
  }
}


