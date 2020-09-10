//import { User } from "../models/user";
import { UserGroup } from "../models/user-group";
import { UserGroupRequest } from "../types/user-groups";
import { NotFound, InvalidFormat } from "../components/handlers/error-handling";
import { auroraConnectApi } from "../components/database/aurora";
import { v4 as uuidv4 } from 'uuid';

export class UserGroupService {
  // User Groups
  public async getUserGroup(user_group_id: string): Promise<any> {
        // Connect to DB
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(UserGroup);
        const findUserGroup = await repository.findOne({ user_group_id: user_group_id });
    
        // If user doesnt exist, then throw error
        if (!findUserGroup) {
          throw new NotFound("UserGroup not found");
        }
    
        // return user
        return findUserGroup;
  }
  public async getUserGroups(): Promise<any> { 
            // Connect to DB
            const connection = await auroraConnectApi();
            const repository = await connection.getRepository(UserGroup);
            const findUserGroups = await repository.find();
        
            // If user doesnt exist, then throw error
            if (!findUserGroups) {
              throw new NotFound("No user groups found, table empty");
            }
        
            // return user
            return findUserGroups;
  }
  public async createUserGroup(body: UserGroupRequest ): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(UserGroup);
    const date = new Date();

    // find user group by name 
    if (!body.user_group_id && body.name) {
      const findUserGroupByName = await repository.findOne({ name: body.name });

      // if name already exists, throw error
      if (findUserGroupByName) {
        throw new InvalidFormat("User Group Name already exists!");
      } 
    }

    // find user group by id, update name
    if (body.user_group_id) {
      const findUserGroupById = await repository.findOne({ user_group_id: body.user_group_id });
      
      // Udpate user group
      if (findUserGroupById) {
        // Update values
        findUserGroupById.name = body.name;
        findUserGroupById.updated_at = date;
        findUserGroupById.scopeGroups = null;
        findUserGroupById.users = null;
        
        // Save to DB
        await repository.save(findUserGroupById);

        // Return updated user
        return findUserGroupById;
      }
    }
    else {
      // Create new user group
      const userGroup: UserGroup = {
        user_group_id: uuidv4(),
        name: body.name,
        created_at: date,
        updated_at: date,
        disabled: false,
        users: null,
        scope_groups: null
      };

      // Save new user group
      const newUserGroup = await repository.save(userGroup);
      
      // Return user group
      return newUserGroup;
    }
  } 
  public async deleteUserGroup(user_group_id: string): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(UserGroup);
    const findUserGroup = await repository.findOne({ user_group_id: user_group_id });

    // If user doesnt exist, then throw error
    if (!findUserGroup) {
      throw new NotFound("UserGroup not found");
    }
    findUserGroup.disabled = true
    await repository.save(findUserGroup);
    // return user
    return "User disabled sucessfully!";
  }
}
