const auth = require('./helpers/aws');
const dotenv = require('dotenv-flow');
const ses = require('./helpers/ses');
const path = require('path');

async function run() {
    try {
        // locat env variables from .env file in root
        dotenv.config({ path: path.resolve(process.cwd(), './environments/') });
        auth.credsConfigLocal();
  
        // Create domain in SES & get DNS Records
        const getDomainRecord = await ses.getSesDomainRecords(process.env.API_DOMAIN);
        const getDkimRecords = await ses.getSesDkimRecords(process.env.API_DOMAIN);

        // Add DNS records to route53
        const recordName = '_amazonses.' + process.env.API_DOMAIN;
        const recordValue = JSON.stringify(getDomainRecord.VerificationToken);
        const verifyDomain = await ses.createRoute53Record(recordName, recordValue, "TXT");
        
        console.log(verifyDomain);

        // Add DKIM records to route53
        for(let index = 0; index < getDkimRecords.DkimTokens.length; index++) {
            console.log(getDkimRecords.DkimTokens[index]);
            const dRecordName = getDkimRecords.DkimTokens[index] + '._domainkey.' + process.env.API_DOMAIN;
            const dRecordValue = getDkimRecords.DkimTokens[index] + '.dkim.amazonses.com';

            console.log('name:', dRecordName);
            console.log('value:', dRecordValue);
            const verifyDkim = await ses.createRoute53Record(dRecordName, dRecordValue, "CNAME");

            console.log(verifyDkim);
        }
    }
    catch(e)
    {
        console.error(e);
    }
 }



 run();