import { v4 as uuidv4 } from 'uuid';
import { generatePasswordHash } from '../components/security/crypto';
import { auroraConnectApi } from '../components/database/aurora';
import { Client } from "../models/client";
import { Conflict, InvalidFormat, NotFound } from '../components/handlers/error-handling';

export class ClientService { 
    public async getClient(clientName: string): Promise<any> {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: clientName });

        if (!findClient) {
            throw new InvalidFormat("No client found by this name");
        }

        return findClient;
    }   
    public async getClients(): Promise<any> {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClients = await repository.find();

        if (!findClients) {
            throw new InvalidFormat("No clients found, table is empty");
        }

        return findClients;
    }
    public async createClient(body: {clientName: string, clientSecret: string}): Promise<any> {
        
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: body.clientName });

        if (findClient) {
            throw new Conflict("Client already exists");
        }

        const clientId = uuidv4();
        const genPassHash = generatePasswordHash(body.clientSecret);
        const salt = genPassHash.salt;
        const clientSecretHash = genPassHash.genHash;
        const date = new Date();

        const client: Client = {
            client_id: clientId,
            client_name: body.clientName,
            client_secret: clientSecretHash,
            client_secret_salt: salt,
            created_at: date,
            updated_at: date,
            disabled: false,
        };
        
        await repository.save(client);

        return {
            clientName: body.clientName,
            clientId: clientId,
            clientSecret: body.clientSecret
        }
    }
    public async updateClient(body: {clientName: string, clientSecret: string}): Promise<any> {
        
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: body.clientName });

        if (!findClient) {
            throw new NotFound("Client does not exists, can't update");
        }

        const genPassHash = generatePasswordHash(body.clientSecret);
        const salt = genPassHash.salt;
        const clientSecretHash = genPassHash.genHash;
        const date = new Date();

        const client: Client = {
            client_name: body.clientName,
            client_secret: clientSecretHash,
            client_secret_salt: salt,
            created_at: date,
            updated_at: date,
            disabled: false,
        };
        
        await repository.save(client);

        return {
            clientName: body.clientName,
            clientSecret: body.clientSecret
        }
    }
    public async deleteClient(clientName: string, softDelete: boolean): Promise<any> {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: clientName });

        if (!findClient) {
            throw new InvalidFormat("No client found by this name");
        }

        if (!softDelete) {
            await repository.delete({ client_name: clientName });
            return "Client has been successfully deleted";
        }

        await repository.save({ client_name: clientName, disabled: true });
        return "Client has been successfully disabled";
    } 
  }