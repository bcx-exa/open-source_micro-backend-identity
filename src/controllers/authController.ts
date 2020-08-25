import { Controller, Body, Route, Post, Tags } from 'tsoa';


@Route('SignUp') // route name => localhost:xxx/SignUp
@Tags('SignUpController') // => Under SignUpController tag    
export class SignUpController extends Controller {    

  @Post()  //specify the request type
  async SignUpPost( @Body() SignUp: string): Promise<any> {    
    try {
      
      SignUp = 'abc'
      // const saltHash = generatePassword(SignUp.password);

      // const salt = saltHash.salt;
      // const hash = saltHash.hash;

      // // Create new user dynamo db


      // // Once created, issue JWT
      // const jwt = issueJWT(user);
      // const result = { success: true, user: user, token:jwt.token, expiresIn: jwt.expires };
      // }

      return SignUp;
    }
    catch(e)
    {
      return e;
    }
   
  }
}


