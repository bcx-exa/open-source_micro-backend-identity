import emailValidator from 'email-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';
import passwordValidator from 'password-validator';

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

export function validatePasswordStrength(): passwordValidator {
    const pwdValidator = new passwordValidator();

    return pwdValidator
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase(2)                              // Must have 2 uppercase letters
        .has().lowercase(2)                              // Must have 2 lowercase letters
        .has().digits(2)                                 // Must have 2 digits
        .has().symbols(2)                                // Must have 2 symbols
        .has().not().spaces()                           // Should not have spaces
}
