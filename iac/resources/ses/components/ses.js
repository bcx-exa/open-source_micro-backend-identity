const AWS = require('aws-sdk');

async function getSesDomainRecords(domain) {  
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
async function getSesDkimRecords(domain) {
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
async function createEmailIdentity(address) {
  try {
    const ses = new AWS.SES();
    const params = { EmailAddress: address };
    const result = await ses.verifyEmailIdentity(params).promise();
  
    return result;
  }
  catch(e) {
    console.error(e);
  }
}


 async function createRoute53Record(name, value, recordType) {
  try {
    const route53 = new AWS.Route53();
    const params = {
      ChangeBatch: {
       Changes: [
          {
         Action: "UPSERT", 
         ResourceRecordSet: {
          Name: name, 
          ResourceRecords: [
             {
            Value: value
           }
          ], 
          TTL: 60, 
          Type: recordType
         }
        }
       ], 
       Comment: "SES Related Records"
      }, 
      HostedZoneId: process.env.HOSTED_ZONE_ID
     };

     const result = await route53.changeResourceRecordSets(params).promise();

      return result;
  }
  catch(e) {
      console.error(e);
  }
}


 module.exports = { getSesDomainRecords, getSesDkimRecords, createEmailIdentity , createRoute53Record }