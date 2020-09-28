import emailValidator from "email-validator";
import { PhoneNumberUtil } from "google-libphonenumber";
import passwordValidator from "password-validator";
import { InvalidFormat, PasswordPolicyException } from "../handlers/error-handling";


export function validateUsername(preferred_username: string | number): any {
  let isValidPhoneNumber: boolean;
  const phoneUtil = PhoneNumberUtil.getInstance();
  const isValidEmail = emailValidator.validate(preferred_username.toString());

  try {
    isValidPhoneNumber = phoneUtil.isValidNumberForRegion(phoneUtil.parse(preferred_username, "ZA"),
      "ZA"
    );
  } catch (e) {
    isValidPhoneNumber = false;
  }

  //if not valid types, throw InvalidFormat
  if (!isValidEmail && !isValidPhoneNumber) {
    throw new InvalidFormat("Not a valid phone number or email address");
  }

  return {
    isValidEmail: isValidEmail,
    isValidPhoneNumber: isValidPhoneNumber,
  };
}

export function validatePasswordStrength(password: string): void {
  const pwdValidator = new passwordValidator();

  pwdValidator
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase(2) // Must have 2 uppercase letters
    .has()
    .lowercase(2) // Must have 2 lowercase letters
    .has()
    .digits(2) // Must have 2 digits
    .has()
    .symbols(2) // Must have 2 symbols
    .has()
    .not()
    .spaces(); // Should not have spaces
  
    const checkPwdStrength = pwdValidator.validate(password);

    // If pwd not strong enough throw
    if (!checkPwdStrength) {
      throw new PasswordPolicyException("Password does not conform to the password policy. The policy enforces the following rules " + pwdValidator.validate("joke", { list: true }));
    }
}
