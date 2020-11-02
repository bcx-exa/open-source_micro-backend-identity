import { OneToMany, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Oauth } from "./oauth";
import { ClientRedirectURI } from "./redirect-uris";

//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity({name: 'client'})
export class Client {
  @PrimaryGeneratedColumn("uuid")
  client_id: string;
  
  @Column()
  client_name?: string;
  
  @Column()
  client_secret?: string;

  @Column()
  trusted?: boolean;

  @Column()
  client_secret_salt?: string;

  @Column("datetime")
  created_at: Date;

  @Column("datetime")
  updated_at: Date;

  @Column()
  disabled: boolean;

  //Join tables on user group side
  @OneToMany(() => ClientRedirectURI, redirect_uri => redirect_uri.client, { nullable: true })
  redirect_uris?: ClientRedirectURI[];

  //Join tables on user group side
  @OneToMany(() => Oauth, oauth => oauth.client, { nullable: true })
  tokens?: Oauth[];
}
