import crypto from 'crypto';

// Encrypt using the public key
export function encryptWithPublicKey(publicKey: string, message: string): any {
    const bufferMessage = Buffer.from(message, 'utf8');

    return crypto.publicEncrypt(publicKey, bufferMessage);
}

// Encrypt using the private key
export function encryptWithPrivateKey(privateKey: string, message): any {
    const bufferMessage = Buffer.from(message, 'utf8');

    return crypto.privateEncrypt(privateKey, bufferMessage);
}
