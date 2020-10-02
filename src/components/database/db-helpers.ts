import { User } from "../../models/user";
import { InternalServerError, NotFound, Unauthorized } from "../../types/response_types";
import { validatePasswordHash } from "../security/crypto";
import { auroraConnectApi } from "./connection";
import { Client } from "../../models/client";

// Find object inside entity using condition
export async function dbFindOneBy(entity: any, condition: any): Promise<any> {
  try {
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(entity);
    const findRecord = await repository.findOne(condition);
  
    if (!findRecord) {
      return new NotFound('Cant find record in the database', 404);
    }
  
    return findRecord;

  } catch (e) {
    return new InternalServerError('Unexpected error occured when trying to find a record in the db', 500, e);
  }
}

// Save or update object or objects in db
export async function dbSaveOrUpdate(entity: any, record: any): Promise<any> {
  try {
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(entity);
    const saveRecord = await repository.save(record);
  
    return saveRecord;

  } catch (e) {
    return new InternalServerError('Unexpected error occured when trying to save a record in the db', 500, e);
  }
}

// Save or update object or objects in db
export async function dbDelete(entity: any, record: any): Promise<any> {
  try {
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(entity);
    const deleteRecord = await repository.delete(record);
  
    return deleteRecord;

  } catch (e) {
    return new InternalServerError('Unexpected error occured when trying to delete a record in the db', 500, e);
  }
}

export async function findUserByUsername(username: string, validatedUsername: any): Promise<any> {
    // Check if user exist
    const connection = await auroraConnectApi();
    const repository = await connection.getRepository(User);

    const find = validatedUsername.isValidEmail
      ? { email: username, disabled: false }
      : { phone_number: username, disabled: false };
    
    const findUser = await repository.findOne(find);

    return findUser;
}

