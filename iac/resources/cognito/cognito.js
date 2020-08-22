const AWS = require('aws-sdk');
const auth = require('./helpers/aws');
const dotenv = require('dotenv-flow');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), './environments/') });
auth.credsConfigLocal();

async function getCustomDomainCf() {
    try {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        const params = { Domain: process.env.UI_DOMAIN };
        const cf = await cognitoidentityserviceprovider.describeUserPoolDomain(params).promise();
    
        return cf;
    }
    catch(e) {
        console.error(e);
    }
}

module.exports.customDomainCf = async () => {
    const cf = await getCustomDomainCf();
    return cf.DomainDescription.CloudFrontDistribution;
  }
  