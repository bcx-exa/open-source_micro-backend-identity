import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn("uuid")
    identity_id: string;

    @Column({ length: 100 })
    preferred_username: string;

    @Column({ length: 300 })
    salt: string;

    @Column({ length: 300 })
    password: string;

    @Column({ nullable: true, length: 100 })
    given_name?: string;
  
    @Column({ nullable: true, length: 100 })
    family_name?: string;

    @Column({ nullable: true, length: 100 })
    picture?: string;

    @Column({ nullable: true, length: 100 })
    phone_number?: string;

    @Column({ nullable: true, length: 100 })
    email?: string;

    @Column({ nullable: true, length: 400 })
    address?: string;
   
    @Column({ nullable: true, length: 400 })
    locale?: string;

    @Column('datetime', { nullable: true })
    birth_date?: Date;
    
    @Column('datetime') 
    created_at: Date;
    
    @Column('datetime') 
    updated_at: Date;

    @Column()
    email_verified: boolean;

    @Column()
    phone_number_verified: boolean;

    @Column()
    signed_up_local: boolean;

    @Column()
    signed_up_google: boolean;

    @Column()
    signed_up_facebook: boolean;

    @Column()
    disabled: boolean;
}

// JWT Model 
export interface UserIdentityJWT {
    sub: string,
    iss: string,
    aud: string,
    iat: number,
    profile: IdentityJWT
}

export type IdentitySignUp = Pick<UserProfile, "preferred_username" | "password" | "given_name" | "family_name" | "email" | "phone_number">;
export type IdentitySignIn = Pick<UserProfile,  "preferred_username" | "password">;
export type IdentityJWT = Pick<UserProfile,  
"identity_id" | "email" | "preferred_username" | "phone_number" | "given_name" | "family_name" | "address" | "birth_date" | "created_at" | "email_verified" | "phone_number_verified" | "locale" | "picture" | "updated_at">;