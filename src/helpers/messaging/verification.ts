import AWS from 'aws-sdk';
import { issueJWT } from '../security/crypto';
import { User } from '../../models/user';
import { phone, email } from '../../types/scopes';

export async function sendVerificationMessage(user: User, isPhoneNumber: boolean, isEmail: boolean):Promise<any> {

  //Create a new Pinpoint object.
  const pinpoint = new AWS.Pinpoint({ region: process.env.PINPOINT_REGION });
  const getApps = await pinpoint.getApps().promise();
  const getApp = getApps.ApplicationsResponse.Item.filter((item) => { return item.Name === process.env.APP_NAME });
  const applicationId = getApp[0].Id;
  const messageType = "TRANSACTIONAL";  
  const destination = user.preferred_username;
  const protocol = process.env.NODE_ENV == 'local' ? 'http://' : 'https://'
  const currentDomain = process.env.NODE_ENV == 'local' ? 'localhost' +  ":" + process.env.PORT : process.env.API_DOMAIN;
  let message = 'Welcome! Please verify your account by clicking on this link: '+ protocol + currentDomain + '/account/verify?token=';
  let params;
  
  if(isPhoneNumber) {
    user.phone_number_verified = true;

    const phoneClaims: phone = {
      phone_number_verified: true,
      phone_number: user.phone_number
    }

    const jwt = await issueJWT(user.identity_id, '1d', true, phoneClaims);
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
    const emailClaims: email = {
      email_verified: true,
      email: user.email
    }
    const jwt = await issueJWT(user.identity_id, '1d', true, emailClaims);
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












