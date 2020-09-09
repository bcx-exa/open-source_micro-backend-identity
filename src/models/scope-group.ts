import { ManyToMany, JoinTable, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Scope } from "./scope"
import { UserGroup } from "./user-group";

//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity()
export class ScopeGroup {
  @PrimaryGeneratedColumn("uuid")
  scope_group_id: string;

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

  @ManyToMany(() => Scope, { nullable: true })
  @JoinTable()
  scopes: Scope[];

  @ManyToMany(() => UserGroup, user_group => user_group.scope_groups, { nullable: true })
  userGroups: UserGroup[];

}
