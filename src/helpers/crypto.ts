import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { UserIdentityDB, UserIdentityJWT } from '../models/identity';
import fs from 'fs';

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

// This generates key pairs used for signing & encryption
export function genKeyPair(): void {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    fs.writeFileSync(process.cwd() + '/src/crypto-keys/pub.pem', keyPair.publicKey);
    fs.writeFileSync(process.cwd() + '/src/crypto-keys/priv.pem', keyPair.privateKey);
}

// Issue jwt
export function issueJWT(identity: UserIdentityDB): any {

    //Get and configure variables
    const expiresIn = '7d';
    const payload: UserIdentityJWT = {
        sub: identity.identity_id,
        iss: process.env.API_DOMAIN,
        aud: process.env.DOMAIN,
        iat: (new Date().getTime()),
        uid: {
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
    const privKeyPath = process.cwd() + '/src/crypto-keys/priv.pem';
    const privKey = fs.readFileSync(privKeyPath, 'utf8');

    // Sign token
    const signedToken = jsonwebtoken.sign(payload, privKey, { expiresIn: expiresIn, algorithm: 'RS256'});
    
    // Return bearer token
    return {
        statusCode: 200,
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}
