import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import AWS from 'aws-sdk';
import ms from "ms";

export function calculateExp (time, iat) {
  const timestamp = iat || Math.floor(Date.now() / 1000);

  if (typeof time === 'string') {
    const milliseconds = ms(time);
    if (typeof milliseconds === 'undefined') {
      return;
    }
    return Math.floor(timestamp + milliseconds / 1000);
  } else if (typeof time === 'number') {
    return timestamp + time;
  } else {
    return;
  }
}


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
export async function signJWT(payload = {}): Promise<any> {
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
        .sign(payload, privKey.Parameter.Value, { algorithm: 'RS256' });

    // Return token
    return signedToken;
}
