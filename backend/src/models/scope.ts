import { ManyToMany, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ScopeGroup } from "./scope-group";

//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity()
export class Scopes {
  @PrimaryGeneratedColumn("uuid")
  scope_id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 300 })
  description: string;

  @Column("datetime")
  created_at: Date;

  @Column("datetime")
  updated_at: Date;
  
  @Column()
  disabled: boolean;

  @ManyToMany(() => ScopeGroup, scope_group => scope_group.scopes, { nullable: true })
  scope_groups?: ScopeGroup[];

}
