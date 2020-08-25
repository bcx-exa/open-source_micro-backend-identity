import fs from 'fs';
import crypto from 'crypto';
import { decryptWithPublicKey } from './decrypt';
import { finalData } from './sign-message';

// Simulating client side

//Get public key
const publicKey = fs.readFileSync(__dirname + '/id_rsa_pub.pem', 'utf8');

// Create hash
const hash = crypto.createHash('sha256');

// Step 1. Decrypt data

const decryptedHash = decryptWithPublicKey(publicKey, finalData.signedAndEncrptedData);

// Step 2. Check if hashes match
const decryptedHashHex = decryptedHash.toString();

const hashOriginal = hash.update(JSON.stringify(finalData.orignalData));
const hashOrignalHex = hash.digest('hex');

if(hashOrignalHex === decryptedHashHex) {
    console.log('Message verified');
}
else {
    console.log('Someone tried to tamper with the data');
}

