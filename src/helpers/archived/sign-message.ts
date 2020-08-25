// import fs from 'fs';
// import crypto from 'crypto';
// import { encryptWithPublicKey, encryptWithPrivateKey } from './encrypt';
// import { decryptWithPrivateKey, decryptWithPublicKey } from './decrypt';

// const hash = crypto.createHash('sha256');

// const data = {
//     firstName: 'Martin',
//     lastName: 'Greyling',
//     idNumber: '123'
// };

// const dataJson = JSON.stringify(data);

// // Generates hash value for the dataJSON object
// hash.update(dataJson);

// // Convert hash to hex after updating with our object
// const hashedData = hash.digest('hex');

// // The private key
// const privateKey = fs.readFileSync(__dirname + '/id_rsa_priv.pem', 'utf8');

// // Include hashed data appose to object in encrypted object
// const signedMessage = encryptWithPrivateKey(privateKey, hashedData);

// export const finalData = {
//     algorithm: 'sha256', // tells received which hash function was used
//     orignalData: data, // the unencrypted data to be used
//     signedAndEncrptedData: signedMessage // receiver should use this to verify data was signed by server & data wasn't tampered with
// };


