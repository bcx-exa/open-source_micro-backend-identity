import { User } from '../models/user';

export type profile = Pick<
  User,
  | "preferred_username"
  | "given_name"
  | "family_name"
  | "address"
  | "birth_date"
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
