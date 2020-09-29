export interface ScopeGroup_Scope_Request 
{
    scope_id: string,
    name?: string,
    description?: string
}

export interface ScopeGroup_UserGroup_Request 
{
    user_group_id: string,
    name?: string,
    description?: string
}

export interface ScopeGroupRequest 
{
    scope_group_id?: string,
    name?: string,
    description?: string,
    scopes?: ScopeGroup_Scope_Request[],
    user_groups?: ScopeGroup_UserGroup_Request[]
}