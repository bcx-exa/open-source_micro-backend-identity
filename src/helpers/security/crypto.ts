import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
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
export async function issueJWT(sub, expiresIn = '7d', verification = false, claims?: any, scopes?: any): Promise<any> {
    
    //Get and configure variables for jwt
    const defaultPayload: any = {
        sub: sub,
        iss: process.env.API_DOMAIN,
        aud: process.env.DOMAIN,
        iat: (new Date().getTime()),
    }

    // Merge additional claims & scopes to payload
    const payload = {
        ...defaultPayload,
        ...claims,
        ...scopes
    };


    // Initialize SSM to get private key
    const ssm = new AWS.SSM({ region: process.env.REGION });
    const params = {
        Name: process.env.PRIVATE_KEY_NAME, /* required */
        WithDecryption: true 
    };

    // Get Private Key
    const privKey = await ssm
        .getParameter(params)
        .promise();

    // Sign token
    const signedToken = jsonwebtoken
        .sign(payload, privKey.Parameter.Value, { expiresIn: expiresIn, algorithm: 'RS256' });

    // Return token
    if (verification) {
        return signedToken;
    } else {
        return  { 
            statusCode: 200,
            token: "Bearer " + signedToken,
            expires: expiresIn
        };
    } 
}
