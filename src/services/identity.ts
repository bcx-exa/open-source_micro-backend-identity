import { UserProfile, IdentitySignIn, IdentitySignUp } from '../models/identity';
import { validatePasswordHash, generatePasswordHash, issueJWT } from '../helpers/crypto';
import { v4 as uuidv4 } from 'uuid';
import { Conflict, Unauthorized, NotVerified } from '../helpers/error-handling';
import { auroraConnectApi } from '../helpers/aurora';
import { Not } from 'typeorm';
// import * as EmailValidator from 'email-validator';
//import { phoneUtil } from 'google-libphonenumber';


export class IdentityService {
    public async SignUp(SignUp: IdentitySignUp): Promise<any> {               
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(UserProfile); 
        const findUser = await repository.findOne({ preferred_username: SignUp.preferred_username });

        if(findUser) { 
            throw new Conflict("User Already Exists");
        } 
        else {

            const genPassHash = generatePasswordHash(SignUp.password);
            const salt = genPassHash.salt;
            const hash = genPassHash.genHash;
            const date = new Date();
            
            const userProfile: UserProfile = {
                identity_id: uuidv4(),
                salt: salt,
                preferred_username: SignUp.preferred_username,
                password: hash, // This is the hash
                given_name: SignUp.given_name,
                family_name: SignUp.family_name,
                picture: null,
                phone_number: "123",
                address: null,
                locale: null,
                email: SignUp.preferred_username,
                birth_date: null,
                email_verified: false,
                phone_number_verified: false,
                created_at: date,
                updated_at: date,
                signed_up_facebook: false,
                signed_up_google: false,
                signed_up_local: true,
                disabled: false
            };

            const repository = await connection.getRepository(UserProfile);  
            await repository.save(userProfile);

            return {
                message: "User signed up sucessfully"
            }
        }
    }

    public async SignIn(SignIn: IdentitySignIn): Promise<any> {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(UserProfile);      
        const findUser = await repository.findOne({ preferred_username: SignIn.preferred_username });

        if(findUser) { 
            const validPassword = validatePasswordHash(SignIn.password, findUser.password, findUser.salt);
            const Identity: UserProfile = findUser as UserProfile;

            if(validPassword) { 
                
                if(findUser.email_verified) {
                    return issueJWT(Identity);
                } 
                else {
                    throw new NotVerified("User email has not been verified");
                }
            }

            throw new Unauthorized("Invalid username or password");         
        } 
        else {
            throw new Unauthorized("Invalid username or password");  
        }
    } 
}
