import { UserRequestId } from './user';
import { ScopeGroupRequestId } from "./scope-group";

export interface UserGroupRequestId
{
    user_group_id?: string
}

export interface UserGroupRequest 
{
    name: string,
    user_group_id?: string,
    users?: UserRequestId[],
    scope_groups?: ScopeGroupRequestId[]
}

