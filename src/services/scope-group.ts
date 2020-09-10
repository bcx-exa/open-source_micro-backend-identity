import { ScopeGroup } from "../models/scope-group";
import { NotFound, InvalidFormat } from "../components/handlers/error-handling";
import { auroraConnectApi } from "../components/database/aurora";
import { findBy, findAll } from "../components/database/db-helpers";
import { v4 as uuidv4 } from 'uuid';
import { ScopeGroupRequest } from "../types/scope-group";

export class ScopeGroupService {
  // Scope Groups
  public async getScopeGroup(scope_group_id: string): Promise<any> {
    // Connect to DB
    const findScopeGroup = await findBy("scope_group_id", scope_group_id, ScopeGroup);

    // If user doesnt exist, then throw error
    if (!findScopeGroup) {
      throw new NotFound("ScopeGroup not found");
    }

    // return user
    return findScopeGroup;
  }
  public async getScopeGroups(): Promise<any> {
    // Connect to DB
    const findScopeGroups = await findAll(ScopeGroup);
    // If user doesnt exist, then throw error
    if (!findScopeGroups) {
      throw new NotFound("No scope groups found, table empty");
    }

    // return user
    return findScopeGroups;
  }
  public async createScopeGroup(body: ScopeGroupRequest): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(ScopeGroup);
    const date = new Date();

    // find user group by name 
    if (!body.scope_group_id && body.name) {
      const findScopeGroupByName = await repository.findOne({ name: body.name, disabled: false });

      // if name already exists, throw error
      if (findScopeGroupByName) {
        throw new InvalidFormat("Scope Group Name already exists!");
      } 
    }
    
    // find scope by id, update name
    if (body.scope_group_id) {
      const findScopeGroupById = await repository.findOne({ scope_id: body.scope_group_id, disabled: false });
      
      // Udpate user group
      if (findScopeGroupById) {
        // Update values
        findScopeGroupById.name = body.name;
        findScopeGroupById.updated_at = date;
        findScopeGroupById.description = body.description;
        findScopeGroupById.user_groups = null;
        findScopeGroupById.scopes = null;

        // Save to DB
        await repository.save(findScopeGroupById);

        // Return updated user
        return findScopeGroupById;
      }
    }
    else {
      // Create new user group

      const scopeGroup: ScopeGroup = {
        scope_group_id: uuidv4(),
        name: body.name,
        description: body.description,
        created_at: date,
        updated_at: date,
        disabled: false,
        user_groups: null,
        scopes: null
      };

      // Save new user group
      const newScopeGroup = await repository.save(scopeGroup);
      
      // Return user group
      return newScopeGroup;
    }
  }
  public async deleteScopeGroup(scope_group_id: string): Promise<any> {
    // Connect to DB
    const findScopeGroup = await findBy("scope_group_id", scope_group_id, ScopeGroup);

    // If user doesnt exist, then throw error
    if (!findScopeGroup) {
      throw new NotFound("ScopeGroup not found");
    }

    // Disable scope group
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(ScopeGroup);

    findScopeGroup.disabled = true;
    await repository.save(findScopeGroup);
  }
}
