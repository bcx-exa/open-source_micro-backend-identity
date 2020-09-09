import { v4 as uuidv4 } from 'uuid';
import { generatePasswordHash } from '../components/security/crypto';
import { auroraConnectApi } from '../components/database/aurora';
import { Client } from "../models/client";
import { InvalidFormat } from '../components/handlers/error-handling';

export class ClientService {
  
    public async creatOauthClient(body: {clientName: string, clientSecret: string}): Promise<any> {
        
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: body.clientName });

        if (findClient) {
            throw new InvalidFormat("Client already exists");
        }

        const clientId = uuidv4();
        const state = uuidv4();
        const genPassHash = generatePasswordHash(body.clientSecret);
        const salt = genPassHash.salt;
        const clientSecretHash = genPassHash.genHash;
        const date = new Date();

        const client: Client = {
            client_id: clientId,
            client_name: body.clientName,
            client_secret: clientSecretHash,
            client_secret_salt: salt,
            state: state,
            created_at: date,
            updated_at: date,
            disabled: false,
        };
        
        await repository.save(client);

        return {
            clientName: body.clientName,
            clientId: clientId,
            clientSecret: body.clientSecret,
            state: state
        }
    }
  
    public async getOauthClients(clientName: string): Promise<any> {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: clientName });

        if (!findClient) {
            throw new InvalidFormat("No client found by this name");
        }

        return findClient;
    }

      
    public async getAllOauthClients(): Promise<any> {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClients = await repository.find();

        if (!findClients) {
            throw new InvalidFormat("No clients found, table is empty");
        }

        return findClients;
    }
    
    public async deleteOauthClients(body: {clientName: string}): Promise<any> {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: body.clientName });

        if (!findClient) {
            throw new InvalidFormat("No client found by this name");
        }

        await repository.delete({ client_name: body.clientName });

        return "Client has been successfully deleted";
    } 
  }