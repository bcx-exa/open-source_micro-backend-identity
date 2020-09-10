
import { signJWT } from '../security/crypto';
import { User } from '../../models/user';
import { openid, phone, email } from '../../types/openid-scopes';
import { sendPinpointMessage } from './pinpoint';

export async function sendVerificationMessage(user: User, isPhoneNumber: boolean, isEmail: boolean):Promise<any> {

  // Openid object
  const openidClaims: openid = {
    sub: user.user_id,
    iss: process.env.API_DOMAIN,   
    aud: process.env.DOMAIN,
    iat: (new Date().getTime()),
    auth_time: (new Date().getTime())
  };
  
  // Phone number payload
  let payload;
  if (isPhoneNumber) {
    // Add phone claims
    const phoneClaims: phone = {
      phone_number_verified: true,
      phone_number: user.phone_number
    }

    payload = {
      ...openidClaims,
      ...phoneClaims
    }
  }
  // Email payload
  if (isEmail) {
    // Add email verified claims
    const emailClaims: email = {
      email_verified: true,
      email: user.email
    }
    payload = {
      ...openidClaims,
      ...emailClaims
    };
  }
  // generate jwt
  const jwt = await signJWT(payload);

  // Send verification message
  const message = "This is to verify your account, please click on the following link: ";
  const uri = "account/verify?token=";
  await sendPinpointMessage(isPhoneNumber, isEmail, user.preferred_username, message, uri, jwt);
}






