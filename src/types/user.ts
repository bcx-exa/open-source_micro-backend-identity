import { UserGroupRequestId } from "./user-groups";

export interface UserRequestId
{
    user_id?: string
}

export interface UserRequest 
{
    user_id?: string,
    preferred_username: string,
    password: string,
    phone?: string,
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
    user_groups?: UserGroupRequestId[]
}


