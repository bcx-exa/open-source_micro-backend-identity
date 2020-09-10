import { User } from "../../models/user";
import { auroraConnectApi } from "./aurora";

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

export async function findBy(key: string, id: string, entity: any):Promise<any> {
  // Check if user exist
  const connection = await auroraConnectApi();
  const repository = await connection.getRepository(entity);
  const findBy = {};
  findBy[key] = id;
  findBy['disabled'] = false;
  const find = await repository.findOne(findBy);

  return find;
}

export async function findAll(entity: any):Promise<any> {
  // Check if user exist
  const connection = await auroraConnectApi();
  const repository = await connection.getRepository(entity);
  const findAll = {};
  findAll['disabled'] = false;
  const find = await repository.find(findAll);

  return find;
}
  