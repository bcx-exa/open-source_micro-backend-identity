import { ManyToOne, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { User } from './user';
import { Client } from './client';
//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity({ name: 'oauth'})
export class Oauth {
  @PrimaryGeneratedColumn("uuid")
  oauth_id: string;

  @Column({length: 100, nullable: true })
  token_link?: string;

  @Column({length: 50})
  token_type: string;

  @Column({ length: 7000 })
  token: string;

  @ManyToOne(() => Client, client => client.tokens)
  client: Client;

  @ManyToOne(() => User, user => user.tokens )
  user: User;

  @Column("datetime")
  created_at: Date;

  @Column("datetime")
  updated_at: Date;

  @Column()
  disabled: boolean;
}
