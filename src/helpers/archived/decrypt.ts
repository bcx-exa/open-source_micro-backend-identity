import crypto from 'crypto';

// Decrypt using the private key
export function decryptWithPrivateKey(privateKey: string, encrypedMessage: any): any {
    return crypto.privateDecrypt(privateKey, encrypedMessage);
}

// Decrypt using the private key
export function decryptWithPublicKey(publicKey: string, encrypedMessage: any): any {
    return crypto.publicDecrypt(publicKey, encrypedMessage);
}

