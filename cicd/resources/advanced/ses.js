const AWS = require('aws-sdk');
const dotenv = require('dotenv');

function credsConfigLocal(creds) {
    try {
      var config = new AWS.Config({
        accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY, region: process.env.REGION
      });

      AWS.config.update(config);
    }
    catch (error) {
      console.error(error);
    }
  }
async function sesVerifyDomain(domain) {  
    try {
        const ses = new AWS.SES();
        const params = { Domain: domain };
        const result = await ses.verifyDomainIdentity(params).promise();

        return result;
    }
    catch(e) {
        console.error(e);
    }
}
async function sesVerifyDkim(domain) {
    try {
        const ses = new AWS.SES();
        const params = { Domain: domain };
        const result = await ses.verifyDomainDkim(params).promise();

        return result;
    }
    catch(e) {
        console.error(e);
    }
}
async function run() {
    var config = dotenv.config();
    console.log(config);

    credsConfigLocal();
    const sesDomainVerify = await sesVerifyDomain(process.env.DOMAIN);
    const sesDkimVerify = await sesVerifyDkim(process.env.DOMAIN);

    console.log(sesDomainVerify);
    console.log(sesDkimVerify);
}

run();