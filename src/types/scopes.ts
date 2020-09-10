import { User } from '../models/user';
import { ScopeGroupRequestId } from './scope-group';

export interface ScopeRequest 
{
    scope_id?: string,
    name: string,
    description: string,
    scope_groups?: ScopeGroupRequestId[]
}

export interface ScopeRequestId
{
    scope_id?: string
}

