
export interface Scope_ScopeGroup_Request 
{
    scope_group_id: string,
    name?: string,
    description?: string
}

export interface ScopeRequest 
{
    scope_id?: string,
    name?: string,
    description?: string,
    scope_groups?:  Scope_ScopeGroup_Request[]
}
