import { User } from '../models/user';

// Account types
export interface VerifyResend
{
  preferred_username: string  
}
export interface PasswordResetRequest
{
  preferred_username: string  
}

export interface PasswordReset {
  password: string
}


export type UserProfileUpdate = Pick<
  User,
  | "preferred_username"
  | "password"
  | "email"
  | "phone_number"
  | "given_name"
  | "family_name"
  | "address"
  | "birthdate"
  | "locale"
  | "picture"
  >;

