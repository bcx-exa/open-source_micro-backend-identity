export interface UserGroup_User_Request 
{
    user_id?: string,
    preferred_username?: string
}
export interface UserGorup_ScopeGroup_Request 
{
    scope_group_id: string,
    name?: string,
    description?: string
}

export interface UserGroupRequest 
{
    user_group_id?: string,
    name?: string,
    description?: string,
    users?: UserGroup_User_Request[],
    scope_groups?: UserGorup_ScopeGroup_Request[]
}

