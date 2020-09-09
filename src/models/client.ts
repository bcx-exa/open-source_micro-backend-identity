import { ManyToMany, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserGroup } from "./user-group";

//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity()
export class Client {
  @PrimaryGeneratedColumn("uuid")
  client_id: string;
  
  @Column()
  client_name: string;
  
  @Column()
    client_secret: string;
    
  @Column()
  client_secret_salt: string;
    
  @Column()
  state: string;

  @Column("datetime")
  created_at: Date;

  @Column("datetime")
  updated_at: Date;

  @Column()
  disabled: boolean;
}
