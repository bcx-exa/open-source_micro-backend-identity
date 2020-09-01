import { StrategyOptions, Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import passport from 'passport';
import AWS from 'aws-sdk';
import { UserProfile, UserIdentityJWT } from '../../models/identity';
import "reflect-metadata";
import { auroraConnectApi } from '../../helpers/aurora';

let initialized = false;

// This registers all the passport strategies
export async function registerStrategies(): Promise<any> {
    if (initialized) return;
    
    const ssm = new AWS.SSM({region: process.env.REGION});
    const params = {
        Name: process.env.PUBLIC_KEY_NAME, /* required */
        WithDecryption: true 
    };
    
    const pubKey = await ssm.getParameter(params).promise();

    const options: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        issuer: process.env.API_DOMAIN,
        secretOrKey: pubKey.Parameter.Value,
        algorithms: ['RS256']
    };

    passport.use(new Strategy(options, async (jwtPayload: UserIdentityJWT, done: VerifiedCallback) => {     
        try {
            const connection = await auroraConnectApi();
            const repository = await connection.getRepository(UserProfile);       
            const user = await repository.findOne({ identity_id: jwtPayload.sub });
    
            if(user) {
                return done(null, user); 
            } else {
                return done(null, false);
            }

        }
        catch(err) {
            return done(err, false);
        } 
    }));



    initialized = true;
}

// This is what TSOA uses for the @Security Decorator
export async function expressAuthentication(
	request: any,
	securityName: string,
    scopes?: string[],
): Promise<any> {
	registerStrategies();

	const strategy: any = passport.authenticate(securityName, {
		session: false
    });
    
    if(scopes) {
        //console.log(scopes);
    }



	const authResult = await new Promise((resolve) =>
		strategy(request, request.res, (err, user) => {
            if(err) {
                throw new Error('Passport Auth Result Error');
            }
            else {
                resolve(user); 
            }
		})
	);
	return authResult;
}