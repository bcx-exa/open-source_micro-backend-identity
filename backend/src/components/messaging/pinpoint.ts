import AWS from 'aws-sdk';

export async function sendPinpointMessage(isPhoneNumber: boolean, isEmail: boolean, destination: string, message: string, uri: string, jwt: any) {
    //Get pinpoint app id
    const pinpoint = new AWS.Pinpoint({ region: process.env.PINPOINT_REGION });
    const getApps = await pinpoint.getApps().promise();
    const getApp = getApps.ApplicationsResponse.Item.filter((item) => { return item.Name === process.env.APP_NAME });
    const applicationId = getApp[0].Id;
    
    // Construct url
    const protocol = process.env.NODE_ENV == 'local'
        ? 'http://'
        : 'https://';
    const currentDomain = process.env.NODE_ENV == 'local'
        ? 'localhost' + ":" + process.env.PORT
        : process.env.API_DOMAIN;
    const url = protocol + currentDomain + '/' + uri;
    message += url; 
    message += jwt;

    // AWS Pinpoint parameters
    let params;

    if (isPhoneNumber) {
         //const shortCode = '';
        params = {
            ApplicationId: applicationId,
            MessageRequest: {
            Addresses: {
                [destination]: {
                ChannelType: 'SMS'
                }
            },
            MessageConfiguration: {
                SMSMessage: {
                Body: message,  
                MessageType: "TRANSACTIONAL",
                //OriginationNumber: originationNumber,
                }
            }
            }
        };
    }

    if (isEmail) {
        params = {
            ApplicationId: applicationId,
            MessageRequest: {
              Addresses: {
                [destination]: {
                  ChannelType: 'EMAIL'
                }
              },
              MessageConfiguration: {
                EmailMessage: {
                  Body: message,
                  FromAddress: process.env.VERIFY_EMAIL_ADDRESS,
                  SimpleEmail: {
                    // HtmlPart: {
                    //   Charset: 'utf-8',
                    //   Data: 
                    // },
                    Subject: {
                      Charset: 'utf-8',
                      Data: 'Verification Email'
                    },
                    TextPart: {
                      Charset: 'utf-8',
                      Data: message
                    }
                  },
                }
              }
            } 
        }
    }
    
      //Try to send the message.
  pinpoint.sendMessages(params, function(err, data) {
    // If something goes wrong, print an error message.
    if(err) {
      console.log(err.message);
    // Otherwise, show the unique ID for the message.
    } else {
      console.log("Message sent! " 
          + data['MessageResponse']['Result'][destination]['StatusMessage']);
    }
  });
}


    
   
    
