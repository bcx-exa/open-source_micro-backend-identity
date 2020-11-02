import { OneToMany, ManyToMany, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserGroup } from "./user-group";
import { Oauth } from './oauth';

//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity({name: 'user'})
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ length: 100 })
  preferred_username: string;

  @Column({ length: 300 })
  salt: string;

  @Column({ length: 300 })
  password: string;

  @Column({ nullable: true, length: 100 })
  name?: string;

  @Column({ nullable: true, length: 100 })
  given_name?: string;

  @Column({ nullable: true, length: 100 })
  family_name?: string;

  @Column({ nullable: true, length: 100 })
  nickname?: string;

  @Column({ nullable: true, length: 100 })
  gender?: string;

  @Column({ nullable: true, length: 3000 })
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
  birthdate?: Date;

  @Column("datetime")
  created_at: Date;

  @Column("datetime")
  updated_at: Date;

  @Column()
  accepted_legal_version: string;

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

  //Join tables on user group side
  @OneToMany(() => Oauth, oauth => oauth.user, { nullable: true })
  tokens?: Oauth[];
  //Join tables on user group side
  @ManyToMany(() => UserGroup, user_group => user_group.users, { nullable: true })
  user_groups?: UserGroup[];
}
