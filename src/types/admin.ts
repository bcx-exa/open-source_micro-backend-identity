import { User } from "../models/user";
import { ScopeGroup } from "../models/scope-group";

export interface UserGroupRequest 
    {
        name: string,
        user_group_id?: string,
        users?: User[],
        scope_groups?: ScopeGroup[]
    }