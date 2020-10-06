import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../../models/user";
import { validatePasswordHash } from "../../components/security/crypto";
import { validateUsername } from "../../components/handlers/validation";
import { dbFindOneBy } from "../../components/database/db-helpers";
import { Unauthorized, NotVerified, NotFound } from "../../types/response_types";

export async function passportLocal() {
  passport.use(
    'local',
    new Strategy(async (username, password, done) => {
      
      // Check if username is of type email or of type phone_number
      const validPreferredUsername = validateUsername(username);
      const isValidEmail = validPreferredUsername.isValidEmail;
      const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;

      // Find Conditions
      const findCondition = isValidEmail
      ? { email: username, disabled: false }
      : { phone_number: username, disabled: false };

      // Check if user exists
      const findUser = await dbFindOneBy(User, findCondition);

      // Can't find user throw unauthorized
      if (findUser instanceof NotFound) {
        const err = new Unauthorized("Invalid username or password");
        return done(err);
      }

      // If account is locked throw
      if (findUser.account_locked) {
        let errorMessage = "Your account has been locked ";
        errorMessage += "as you have requested too many verification requests, please contact support";
        const err = new Unauthorized(errorMessage);
        return done(err);
      }

      // Valid email address but email not verified
      if (isValidEmail && !findUser.email_verified) {
        const err = new NotVerified("User email has not been verified");
        return done(err);
      }

      // Valid phone number but phone number not verified
      if (isValidPhoneNumber && !findUser.phone_number_verified) {
        const err = new NotVerified("User phone number has not been verified");
        return done(err);
      }

      // Validate password
      const validPassword = validatePasswordHash(password, findUser.password, findUser.salt);

      if (!validPassword) {
        const err = new Unauthorized('Not a valid username or password');
        return done(err);
      }

      return done(null, findUser);
    }));
  }


