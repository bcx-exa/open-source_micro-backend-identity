import { v4 as uuidv4 } from 'uuid';
import { generatePasswordHash } from '../components/security/crypto';
import { auroraConnectApi } from '../components/database/aurora';
import { Client } from "../models/client";
import { Conflict, InvalidFormat, NotFound } from '../components/handlers/error-handling';
import { ClientPost } from '../types/client';

export class ClientService { 
    public async getClient(client_name: string): Promise<any> {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: client_name });

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
    public async createClient(body: ClientPost ): Promise<any> {
        
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: body.client_name });

        if (findClient) {
            throw new Conflict("Client already exists");
        }

        const client_id = uuidv4();
        const genPassHash = generatePasswordHash(body.client_secret);
        const salt = genPassHash.salt;
        const clientSecretHash = genPassHash.genHash;
        const date = new Date();

        const client: Client = {
            client_id: client_id,
            client_name: body.client_name,
            client_secret: clientSecretHash,
            client_secret_salt: salt,
            redirect_uri: body.redirect_uri,
            created_at: date,
            updated_at: date,
            disabled: false,
        };
        
        await repository.save(client);

        return {
            client_name: body.client_name,
            client_id: client_id,
            client_secret: body.client_secret,
            redirect_uri: body.redirect_uri
        }
    }
    public async updateClient(body: ClientPost ): Promise<any> {
        
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: body.client_name });

        if (!findClient) {
            throw new NotFound("Client does not exists, can't update");
        }

        const genPassHash = generatePasswordHash(body.client_secret);
        const salt = genPassHash.salt;
        const clientSecretHash = genPassHash.genHash;
        const date = new Date();

        const client: Client = {
            client_name: body.client_name,
            client_secret: clientSecretHash,
            client_secret_salt: salt,
            redirect_uri: body.redirect_uri,
            created_at: date,
            updated_at: date,
            disabled: false,
        };
        
        await repository.save(client);

        return {
            client_name: body.client_name,
            client_id: findClient.client_id,
            client_secret: body.client_secret,
            redirect_uri: body.redirect_uri
        }
    }
    public async deleteClient(client_name: string, softDelete: boolean): Promise<any> {
        const connection = await auroraConnectApi();
        const repository = await connection.getRepository(Client);
        const findClient = await repository.findOne({ client_name: client_name });

        if (!findClient) {
            throw new InvalidFormat("No client found by this name");
        }

        if (!softDelete) {
            await repository.delete({ client_name: client_name });
            return "Client has been successfully deleted";
        }

        await repository.save({ client_name: client_name, disabled: true });
        return "Client has been successfully disabled";
    } 
  }