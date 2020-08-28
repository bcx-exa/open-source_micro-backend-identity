 const AWS = require('aws-sdk');
 const crypto = require('crypto');
 const fs = require('fs');
 const path = require('path');
 const dotenv = require('dotenv-flow');

 dotenv.config({ path: path.resolve(process.cwd(), './environments/') });
 console.log(process.env.NODE_ENV);
 if(process.env.NODE_ENV == 'local') {
    const config = new AWS.Config({
        accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY, region: process.env.REGION
      });
    
      AWS.config.update(config);
 }


 // Generate keys if they don't exist
 function genKeyPair() {
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

    fs.writeFileSync(process.cwd() + '/iac/crypto-keys/pub.pem', keyPair.publicKey);
    fs.writeFileSync(process.cwd() + '/iac/crypto-keys/priv.pem', keyPair.privateKey);
}

const pubKeyExist = path.resolve(process.cwd(), '/iac/crypto-keys/pub.pem');
if (!fs.existsSync(pubKeyExist)) genKeyPair();

// Add keys to parameter store
async function addParameters(name, value) {
    const ssm = new AWS.SSM();
    var params = {
        Name: name, /* required */
        Value: value, /* required */
        Overwrite: true,
        Type: 'SecureString'
      };
      ssm.putParameter(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
}

// Add keys to parameter store
const privKeyPath = process.cwd() + '/iac/crypto-keys/priv.pem';
const privKey = fs.readFileSync(privKeyPath, 'utf8');
const pubKeyPath = process.cwd() + '/iac/crypto-keys/pub.pem';
const pubKey = fs.readFileSync(pubKeyPath, 'utf8');

if(process.env.OVERWRITE_PUB_PRIV_KEYS) {
    addParameters(process.env.PRIVATE_KEY_NAME, privKey);
    addParameters(process.env.PUBLIC_KEY_NAME, pubKey);
}
