import AWS from 'aws-sdk';
import { issueJWT } from './crypto';
import { UserProfile } from '../models/identity';

export async function sendVerificationMessage(userProfile: UserProfile, isPhoneNumber: boolean, isEmail: boolean):Promise<any> {

  //Create a new Pinpoint object.
  const pinpoint = new AWS.Pinpoint({ region: process.env.PINPOINT_REGION });
  const getApps = await pinpoint.getApps().promise();
  const getApp = getApps.ApplicationsResponse.Item.filter((item) => { return item.Name === process.env.APP_NAME });
  const applicationId = getApp[0].Id;
  const messageType = "TRANSACTIONAL";  
  const destination = userProfile.preferred_username;
  const protocol = process.env.NODE_ENV == 'local' ? 'http://' : 'https://'
  const currentDomain = process.env.NODE_ENV == 'local' ? 'localhost' +  ":" + process.env.PORT : process.env.API_DOMAIN;
  let message = 'Welcome! Please verify your account by clicking on this link: '+ protocol + currentDomain + '/auth/verify?token=';
  let params;
  
  if(isPhoneNumber) {
    userProfile.phone_number_verified = true;
    const jwt = await issueJWT(userProfile, true);
    message += jwt; 
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
            MessageType: messageType,
            //OriginationNumber: originationNumber,
          }
        }
      }
    };
  }
  if(isEmail) {
    userProfile.email_verified = true;
    const jwt = await issueJWT(userProfile, true);
    message += jwt; 
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












