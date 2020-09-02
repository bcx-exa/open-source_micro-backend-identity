import { User } from '../models/user';
// Authentication Request Types
export type SignUp = Pick<User,"preferred_username" | "password" | "given_name" | "family_name">;
export type SignIn = Pick<User, "preferred_username" | "password">;