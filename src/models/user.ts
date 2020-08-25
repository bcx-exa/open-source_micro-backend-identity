// Db Model
export interface User {
    id: string,
    salt: string,
    username: string,
    password: string, // This is the hash
    firstName: string,
    lastName: string,
    phoneNumber: string,
    address: string,
    email: string,
    emailVerified: boolean,
    phoneNumberVerified: boolean,
    scopes: string[],
    roles: string[]
}

// Objects used in user controllers

export type UserSignUp = Pick<User, "username" | "password" | "firstName" | "lastName" | "email" | "phoneNumber" | "address">;
export type UserSignIn = Pick<User, "username" | "password">;