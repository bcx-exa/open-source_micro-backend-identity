import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity()
export class User {
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

  @Column("datetime", { nullable: true })
  birth_date?: Date;

  @Column("datetime")
  created_at: Date;

  @Column("datetime")
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

  @Column()
  verification_attempts: number;

  @Column()
  account_locked: boolean;

  @Column({ nullable: true })
  googleId: string;
}
