import { signJWT } from '../security/crypto';
import { User } from '../../models/user';
import { openid } from '../../types/openid-scopes';
import { sendPinpointMessage } from './pinpoint';

export async function sendPasswordResetRequest(user: User, isPhoneNumber: boolean, isEmail: boolean): Promise<void> {
  
  // Message
  let message = 'You or someone else have requested a password reset, '
  message += 'Please click the link to reset your password: '
  
  // Openid object
  const openidClaims: openid = {
    sub: user.user_id,
    iss: process.env.API_DOMAIN,   
    aud: process.env.DOMAIN,
    iat: (new Date().getTime()),
    auth_time: (new Date().getTime())
  };

  // password reset object
  const passworedReset = {
    password_reset: true,
  }

  // final payload
  const payload = {
    ...openidClaims,
    ...passworedReset
  };

  // Generate JWT
  const uri = "/account/password/reset?token="
  const jwt = await signJWT(payload);
  await sendPinpointMessage(isPhoneNumber, isEmail, user.preferred_username, message, uri, jwt);

}












