import { UserProfile, SignIn, SignUp } from "../models/identity";
import { validatePasswordHash, generatePasswordHash, issueJWT } from "../helpers/crypto";
import { v4 as uuidv4 } from "uuid";
import { Conflict, Unauthorized, NotVerified, InvalidFormat } from "../helpers/error-handling";
import { auroraConnectApi } from "../helpers/aurora";
import { validateUsername } from "../helpers/validation";
import { SuccessResponse, Response } from "tsoa";

export class IdentityService {
  public async SignUp(SignUp: SignUp): Promise<any> {
    const validPreferredUsername = validateUsername(SignUp.preferred_username);
    const isValidEmail = validPreferredUsername.isValidEmail;
    const isValidPhoneNumber = validPreferredUsername.isValidPhoneNumber;

    if (!isValidEmail && !isValidPhoneNumber) throw new InvalidFormat("Not a valid phone number or email address");

    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(UserProfile);

    let findUser: any;

    if (isValidEmail) {
      findUser = await repository.findOne({ email: SignUp.preferred_username });
    }
    if (isValidPhoneNumber) {
      findUser = await repository.findOne({ phone_number: SignUp.preferred_username });
    }
    if (findUser) {
      throw new Conflict("User Already Exists");
    } else {
      const genPassHash = generatePasswordHash(SignUp.password);
      const salt = genPassHash.salt;
      const hash = genPassHash.genHash;
      const date = new Date();

      const userProfile: UserProfile = {
        identity_id: uuidv4(),
        salt: salt,
        preferred_username: SignUp.preferred_username,
        password: hash, // This is the hash
        given_name: SignUp.given_name,
        family_name: SignUp.family_name,
        picture: null,
        phone_number: isValidPhoneNumber ? SignUp.preferred_username : null,
        address: null,
        locale: null,
        email: isValidEmail ? SignUp.preferred_username : null,
        birth_date: null,
        email_verified: false,
        phone_number_verified: false,
        created_at: date,
        updated_at: date,
        signed_up_facebook: false,
        signed_up_google: false,
        signed_up_local: true,
        disabled: false,
        googleId: null,
      };

      const repository = await connection.getRepository(UserProfile);
      await repository.save(userProfile);

      return "User signed up sucessfully";
    }
  }

  public async SignIn(SignIn: SignIn): Promise<any> {
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(UserProfile);
    const findUser = await repository.findOne({ preferred_username: SignIn.preferred_username });

    if (findUser) {
      const validPassword = validatePasswordHash(SignIn.password, findUser.password, findUser.salt);
      const Identity: UserProfile = findUser as UserProfile;

      if (validPassword) {
        if (findUser.email_verified) {
          return issueJWT(Identity);
        } else {
          throw new NotVerified("User email has not been verified");
        }
      }

      throw new Unauthorized("Invalid username or password");
    } else {
      throw new Unauthorized("Invalid username or password");
    }
  }
}
