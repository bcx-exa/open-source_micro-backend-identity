export interface User_UserGroup_Request
{
    user_group_id: string,
    name?: string,
    description?: string
}

export interface UserRequest 
{
    user_id?: string,
    preferred_username?: string,
    password?: string,
    phone_number?: string,
    email?: string,
    address?: string,
    locale?: string,
    birthdate?: Date,
    name?: string,
    given_name?: string,
    family_name?: string,
    nickname?: string,
    gender?: string,
    picture?: string,
    user_groups?: User_UserGroup_Request[]
}




