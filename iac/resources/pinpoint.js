const AWS = require('aws-sdk');
const dotenv = require('dotenv-flow');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), './environments/') });

if(process.env.NODE_ENV == 'local') {
   const config = new AWS.Config({
       accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY, region: process.env.REGION
     });
   
     AWS.config.update(config);
}

async function createPinpointApp() {
    var pinpoint = new AWS.Pinpoint({region: 'eu-central-1', apiVersion: '2016-12-01'});
    var params = {
        CreateApplicationRequest: { /* required */
          Name: process.env.APP_NAME
        }
      };
      const pinpointApp = pinpoint.createApp(params);
      console.log(pinpointApp);
    //   var params = {
    //     ApplicationId: 'STRING_VALUE', /* required */
    //     EmailChannelRequest: { /* required */
    //       FromAddress: 'STRING_VALUE', /* required */
    //       Identity: 'STRING_VALUE', /* required */
    //       ConfigurationSet: 'STRING_VALUE',
    //       Enabled: true || false,
    //       RoleArn: 'STRING_VALUE'
    //     }
    //   };
    //   pinpoint.updateEmailChannel(params, function(err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else     console.log(data);           // successful response
    //   });
}

function createEmailIdentity() {
    var pinpointemail = new AWS.PinpointEmail({region: process.env.REGION, apiVersion: '2018-07-26'});

    // Create App
      var params = {
        EmailIdentity: process.env.VERIFY_EMAIL_ADDRESS /* required */
      };
      pinpointemail.createEmailIdentity(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });

}

createPinpointApp().then(d => console.log(d)).catch(e => console.error(e));


