import { v4 as uuidv4 } from 'uuid';
import { generatePasswordHash } from '../components/security/crypto';
import { auroraConnectApi } from '../components/database/connection';
import { Client } from "../models/client";
import { Conflict, NotFound } from '../types/response_types';
import { ClientPost } from '../types/client';
import { ClientRedirectURI } from '../models/redirect-uris';
import { dbDelete, dbFindManyBy, dbFindOneBy, dbSaveOrUpdate } from '../components/database/db-helpers';

export class ClientService {
    public async getClient(client_id: string): Promise<any> {
        const findClient = await dbFindOneBy(Client, { where: { client_id: client_id }, relations: ['redirect_uris']  });

        if (findClient instanceof NotFound) {
            throw findClient;
        }

        return findClient;
    }
    public async getClients(): Promise<any> {
        const findClients = await dbFindManyBy(Client, { relations: ['redirect_uris'] });

        if (findClients instanceof NotFound) {
            throw findClients;
        }

        return findClients;
    }
    public async createClient(body: ClientPost): Promise<any> {
        const findClient = await dbFindOneBy(Client, { client_name: body.client_name });

        if (!(findClient instanceof NotFound)) {
            throw new Conflict("Client already exists");
        }

        const connection = await auroraConnectApi();

        const client_id = body.client_id ? body.client_id : uuidv4();
        const genPassHash = generatePasswordHash(body.client_secret);
        const salt = genPassHash.salt;
        const clientSecretHash = genPassHash.genHash;
        const date = new Date();

        const redirect_uris = [];

        body.redirect_uris.forEach(r => {
            const redirect_uri = new ClientRedirectURI();

            redirect_uri.redirect_uri_id = uuidv4();
            redirect_uri.redirect_uri = r;
            redirect_uri.updated_at = date;
            redirect_uri.created_at = date;
            redirect_uri.disabled = false;
            redirect_uris.push(redirect_uri);
        });

        await connection.manager.save(redirect_uris);

        const client = new Client();

        client.client_id = client_id;
        client.client_name = body.client_name;
        client.trusted = body.trusted;
        client.client_secret = clientSecretHash;
        client.client_secret_salt = salt;
        client.redirect_uris = redirect_uris;
        client.created_at = date;
        client.updated_at = date;
        client.disabled = false;

        await connection.manager.save(client);

        return {
            client_name: body.client_name,
            client_id: client_id,
            client_secret: body.client_secret,
            trusted: body.trusted,
            redirect_uris: redirect_uris
        }
    }
    public async updateClient(body: ClientPost): Promise<any> {
        const findClient = await dbFindOneBy(Client, { client_id: body.client_id });

        if (findClient instanceof NotFound) {
            throw findClient;
        }

        const connection = await auroraConnectApi();

        const client_id = body.client_id;

        let salt, clientSecretHash;

        if(body.client_secret) {
            const genPassHash = generatePasswordHash(body.client_secret);
            salt = genPassHash.salt;
            clientSecretHash = genPassHash.genHash;
        }


        const date = new Date();

        const redirect_uris = [];

        body.redirect_uris.forEach(r => {
            const redirect_uri = new ClientRedirectURI();

            redirect_uri.redirect_uri_id = uuidv4();
            redirect_uri.redirect_uri = r;
            redirect_uri.updated_at = date;
            redirect_uri.created_at = date;
            redirect_uri.disabled = false;

            redirect_uris.push(redirect_uri);
        });

        await connection.manager.save(redirect_uris);

        const client = new Client();

        client.client_id = client_id;
        client.client_name = body.client_name;
        client.trusted = body.trusted;
        client.client_secret = clientSecretHash;
        client.client_secret_salt = salt;
        client.redirect_uris = redirect_uris;
        client.created_at = date;
        client.updated_at = date;
        client.disabled = false;

        await connection.manager.save(client);

        return {
            client_name: body.client_name,
            client_id: client_id,
            client_secret: body.client_secret,
            trusted: body.trusted,
            redirect_uris: redirect_uris
        }
    }
    public async deleteClient(client_id: string, softDelete: boolean): Promise<any> {
        const findClient = await dbFindOneBy(Client, { where: { client_id: client_id }, relations: ['redirect_uris']  });

        if (findClient instanceof NotFound) {
            throw findClient;
        }

        if (!softDelete) {
            await dbDelete(Client, { client_id: client_id });
            return "Client has been successfully deleted";
        }

        await dbSaveOrUpdate(Client, { client_id: client_id, disabled: true });
        return "Client has been successfully disabled";
    }
}