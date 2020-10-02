import { ManyToOne, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client";

//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity()
export class ClientRedirectURI {
  @PrimaryGeneratedColumn("uuid")
  redirect_uri_id: string;

  @Column()
  redirect_uri: string;

  @ManyToOne(() => Client, client => client.redirect_uris, { nullable: true })
  client?: Client;

  @Column("datetime")
  created_at: Date;

  @Column("datetime")
  updated_at: Date;

  @Column()
  disabled: boolean;
}
