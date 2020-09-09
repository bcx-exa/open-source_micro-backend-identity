import { ManyToMany, JoinTable, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user"
import { ScopeGroup } from "./scope-group";

//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity()
export class UserGroup {
  @PrimaryGeneratedColumn("uuid")
  user_group_id: string;

  @Column({ length: 100 })
  name: string;

  @Column("datetime")
  created_at: Date;

  @Column("datetime")
  updated_at: Date;

  @Column()
  disabled: boolean;

  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  users: User[];

  @ManyToMany(() => ScopeGroup, { nullable: true })
  @JoinTable()
  scope_groups: ScopeGroup[];
}
