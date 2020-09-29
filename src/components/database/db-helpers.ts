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

