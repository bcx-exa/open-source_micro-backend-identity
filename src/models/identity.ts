// Db Model

//https://www.iana.org/assignments/jwt/jwt.xhtml
export interface UserIdentityDB {
    identity_id: string,
    salt: string,
    preferred_username: string,
    password: string, // This is the hash
    given_name?: string,
    family_name?: string,
    picture?: string
    phone_number?: string,
    address?: string,
    locale?: string,
    email?: string,
    birth_date?: Date,
    email_verified: boolean,
    phone_number_verified: boolean,
    created_at: Date,
    updated_at: Date
}

// JWT Model 
export interface UserIdentityJWT {
    sub: string,
    iss: string,
    aud: string,
    iat: number,
    uid: IdentityJWT
}

export type IdentitySignUp = Pick<UserIdentityDB, "preferred_username" | "password" | "given_name" | "family_name" | "email" | "phone_number">;
export type IdentitySignIn = Pick<UserIdentityDB,  "preferred_username" | "password">;
export type IdentityJWT = Pick<UserIdentityDB,  
"identity_id" | "email" | "preferred_username" | "phone_number" | "given_name" | "family_name" | "address" | "birth_date" | "created_at" | "email_verified" | "phone_number_verified" | "locale" | "picture" | "updated_at">;