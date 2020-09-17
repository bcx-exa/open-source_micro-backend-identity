import { ManyToMany, JoinTable, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Scopes } from "./scope";
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

  @ManyToMany(() => Scopes, scopes => scopes.scope_groups, { nullable: true })
  @JoinTable()
  scopes?: Scopes[];

  @ManyToMany(() => UserGroup, user_group => user_group.scope_groups, { nullable: true })
  user_groups?: UserGroup[];

}
