import { User } from '../models/user';



export type openid = 
  { sub: string,
    iss: string,
    aud: string,
    iat: number,
    auth_time: number };

export type profile = Pick<
  User,
  | "nickname"
  | "gender"
  | "name"
  | "preferred_username"
  | "given_name"
  | "family_name"
  | "address"
  | "birthdate"
  | "created_at"
  | "locale"
  | "picture"
  | "updated_at"
  >;

export type email = Pick<
  User,
  | "email"
  | "email_verified"
  >;

  export type phone = Pick<
  User,
  | "phone_number"
  | "phone_number_verified"
>;
