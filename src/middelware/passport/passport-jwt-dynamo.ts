import { StrategyOptions, Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Request } from 'express';
import passport from 'passport';
import AWS from 'aws-sdk';
import { UserIdentityJWT, UserProfile } from '@/models/identity';
import { ApiError } from '../../helpers/error-handling';
import { auroraConnectApi } from '../../helpers/aurora';
import "reflect-metadata";


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
        // const dynamo = new AWS.DynamoDB.DocumentClient();

        // const params = {
        //     TableName: process.env.DB_TABLE_NAME,
        //     KeyConditionExpression: '#identity_id= :identity_id',
        //     ExpressionAttributeNames: {
        //         '#identity_id': 'identity_id'
        //     },
        //     ExpressionAttributeValues: {
        //         ':identity_id': jwtPayload.sub
        //     }
        //   };
          
        //   dynamo.query(params, function(err, user) {
        //     if (err) return done(err, false);
        //     else { 
        //         if(user.Items.length != 0) {
        //             return done(null, user);     
        //         }
        //         else {
        //             return done(null, false);
        //         }
        //     }
        //  });

        const connection = await auroraConnectApi();
        const repository = connection.getRepository(UserProfile);
        
        const user = await repository.findOne({ identity_id: jwtPayload.sub });

        if(user) {
            return done(null, user); 
        } else {
            return done(null, false);
        }

    }));

	initialized = true;
}

// This is what TSOA uses for the @Security Decorator
export async function expressAuthentication(
	request: Request,
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
                throw new ApiError("Internal Server Error", 500, err); 
            }
            else {
                resolve(user); 
            }
		})
	);
	return authResult;
}