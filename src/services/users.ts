import { User, UserLogin, UserSignUp } from '../models/user';
import { generatePasswordHash } from '../helpers/crypto'

export class UsersService {
    public SignUp(SignUp: UserSignUp): UserSignUp {
        
        const genPassHash = generatePasswordHash(SignUp.password);

        const salt = genPassHash.salt;
        const hash = genPassHash.hash;
  
        // Create new user dynamo db
  
  
        // Once created, issue JWT
        const jwt = issueJWT(user);


        return jwt;
    }

    public GetUserById(id: string): any {
        return 'oasd';
    }
}