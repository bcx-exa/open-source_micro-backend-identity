import { User } from '../models/user';

// Account types
export type VerifyResend = Pick<User, "preferred_username">;
export type PasswordResetRequest = Pick<User, "preferred_username">;
export type PasswordReset = Pick<User, 'password'>;
export type UserProfileUpdate = Pick<
  User,
  | "preferred_username"
  | "password"
  | "email"
  | "phone_number"
  | "given_name"
  | "family_name"
  | "address"
  | "birth_date"
  | "locale"
  | "picture"
  >;

