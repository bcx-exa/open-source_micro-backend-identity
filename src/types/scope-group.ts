import { UserGroupRequestId } from './user-group';
import { ScopeRequestId } from './scopes';

export interface ScopeGroupRequest 
{
    scope_group_id?: string,
    name: string,
    description: string,
    scopes?: ScopeRequestId[],
    user_groups?: UserGroupRequestId[]
}

export interface ScopeGroupRequestId
{
    scope_group_id?: string
}
