import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { UserProfile, UserIdentityJWT } from '../models/identity';
import AWS from 'aws-sdk';

// Helper method to create a hash from the clear text user password
export function generatePasswordHash(password: string): any {
    // Generate Salt
    const salt = crypto.randomBytes(32).toString('hex');
    // Generate hast to be saved in Db
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');   
    return {
        salt: salt,
        genHash: genHash
    };
}

// Helper method to verify a hash from the clear text user password
export function validatePasswordHash(password:string , dbHash: string, salt: string): boolean {
    // Generates hash from user's password
    const userHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    // Check if hash in db is the same as the one generated
    return userHash === dbHash;
}

// Issue jwt
export async function issueJWT(identity: UserProfile ): Promise<any> {

    //Get and configure variables
    const expiresIn = '7d';
    const payload: UserIdentityJWT = {
        sub: identity.identity_id,
        iss: process.env.API_DOMAIN,
        aud: process.env.DOMAIN,
        iat: (new Date().getTime()),
        profile: {
            identity_id: identity.identity_id,
            preferred_username: identity.preferred_username,
            email: identity.email,
            phone_number: identity.phone_number,
            picture: identity.picture,
            address: identity.address,
            phone_number_verified: identity.phone_number_verified,
            email_verified: identity.email_verified,
            created_at: identity.created_at,
            updated_at: identity.updated_at
        }
    }
    const ssm = new AWS.SSM({region: process.env.REGION});
    const params = {
        Name: process.env.PRIVATE_KEY_NAME, /* required */
        WithDecryption: true 
    };
    
    const privKey = await ssm.getParameter(params).promise();
  
    // Sign token
    const signedToken = jsonwebtoken.sign(payload, privKey.Parameter.Value, { expiresIn: expiresIn, algorithm: 'RS256'});
    
    // Return bearer token
    return {
        statusCode: 200,
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}
