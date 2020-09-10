import { Scopes } from "../models/scope";
import { NotFound, InvalidFormat } from "../components/handlers/error-handling";
import { auroraConnectApi } from "../components/database/aurora";
import { findBy, findAll } from "../components/database/db-helpers";
import { ScopeRequest } from "../types/scopes";
import { v4 as uuidv4 } from 'uuid';


export class ScopesService {
  public async getScope(scope_id: string): Promise<any> {
    // Connect to DB
    const findScope = await findBy("scope_id", scope_id, Scopes);

    // If user doesnt exist, then throw error
    if (!findScope) {
      throw new NotFound("Scope not found");
    }
    // return user
    return findScope;
  }
  public async getScopes(): Promise<any> {
    // Connect to DB
    const findScopes = await findAll(Scopes);
    
    // If user doesnt exist, then throw error
    if (!findScopes) {
      throw new NotFound("No scopes found, table empty");
    }

    // return user
    return findScopes;
  }
  public async createScope(body: ScopeRequest): Promise<any> {
    // Connect to DB
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Scopes);
    const date = new Date();

    // find user group by name 
    if (!body.scope_id && body.name) {
      const findScopeByName = await repository.findOne({ name: body.name, disabled: false });

      // if name already exists, throw error
      if (findScopeByName) {
        throw new InvalidFormat("Scope Name already exists!");
      } 
    }

    // find scope by id, update name
    if (body.scope_id) {
      const findScopeById = await repository.findOne({ scope_id: body.scope_id });
      
      // Udpate user group
      if (findScopeById ) {
        // Update values
        findScopeById.name = body.name;
        findScopeById.updated_at = date;
        findScopeById.scope_groups = null;
        
        // Save to DB
        await repository.save(findScopeById);

        // Return updated user
        return findScopeById;
      }
    }
    else {
      // Create new user group

      const scope: Scopes = {
        scope_id: uuidv4(),
        name: body.name,
        description: body.description,
        created_at: date,
        updated_at: date,
        disabled: false,
        scope_groups: null
      };

      // Save new user group
      const newScope = await repository.save(scope);
      
      // Return user group
      return newScope;
    }
  }
  public async deleteScope(scope_id: string): Promise<any> {
    // Connect to DB
    const findScope = await findBy("scope_id", scope_id, Scopes);
  
    // If user doesnt exist, then throw error
    if (!findScope) {
      throw new NotFound("Scope not found");
    }

    // Disable scope
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(Scopes);
    findScope.disabled = true;
    await repository.save(findScope);
    
    return "Scope disabled sucessfully";
  }
}
