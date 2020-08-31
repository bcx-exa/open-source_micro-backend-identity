import emailValidator from 'email-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';

export function validateUsername(preferred_username: string | number): any {
    
    let isValidPhoneNumber: boolean;
    const phoneUtil = PhoneNumberUtil.getInstance();
        
    const isValidEmail = emailValidator.validate(preferred_username.toString());
    
    try {
        isValidPhoneNumber = phoneUtil.isValidNumberForRegion(phoneUtil.parse(preferred_username, 'ZA'), 'ZA');
        console.log(isValidPhoneNumber);
    } catch (e) {
        isValidPhoneNumber = false;
    }

    return {
        isValidEmail: isValidEmail,
        isValidPhoneNumber: isValidPhoneNumber
    }


}