// Db Model
export interface User {
    id: string,
    username: string,
    salt: string,
    password: string, // This is the hash
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    emailVerified: boolean,
    phoneNumberVerified: boolean
}

// Objects used in user controllers
export type UserSignUp = Pick<User, "username" | "password" | "firstName" | "lastName" | "email" | "phoneNumber">;
export type UserLogin = Pick<User, "username" | "password">;