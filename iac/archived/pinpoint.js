const AWS = require('aws-sdk');

async function checkAppExistDelete() {
    try {
        var pinpoint = new AWS.Pinpoint({region: 'eu-central-1', apiVersion: '2016-12-01'});
    
        var params = {
          PageSize: '10',
        };
    
        const getApps = await pinpoint.getApps(params).promise();   
        const appExist = getApps.ApplicationsResponse.Item[0].Name == process.env.APP_NAME;
    
        if(appExist) {
            var params = {
                    ApplicationId: getApps.ApplicationsResponse.Item[0].Id /* required */
                };
                pinpoint.deleteApp(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
                });
        }
    } catch(e) {
        console.log(e);
    }
}

// Create pinpoint app
async function createPinpointApp(accountId) {
    
    var pinpoint = new AWS.Pinpoint({region: 'eu-central-1', apiVersion: '2016-12-01'});
    await checkAppExistDelete();

    var params = {
            CreateApplicationRequest: { /* required */
                Name: process.env.APP_NAME
            }
        };
        
    const app = await pinpoint.createApp(params).promise();

    var params = {
        ApplicationId:  app.ApplicationResponse.Id, /* required */
        EmailChannelRequest: { /* required */
            FromAddress: process.env.VERIFY_EMAIL_ADDRESS, /* required */
            Identity: 'arn:aws:ses:' + process.env.PINPOINT_REGION + ':' + accountId + ':' + process.env.APP_NAME + '/' + process.env.API_DOMAIN
        }
    };

    
    const createEmailChannel = await pinpoint.updateEmailChannel(params).promise();
    
    var params = {
        ApplicationId: app.ApplicationResponse.Id, /* required */
        SMSChannelRequest: { /* required */
          Enabled: true,
        }
      };
    
    const smsChannel = await pinpoint.updateSmsChannel(params).promise();
        
      
    console.log(createEmailChannel);
    console.log(smsChannel);


       
}

module.exports = { createPinpointApp }