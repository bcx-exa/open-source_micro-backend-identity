import { createConnection, getConnection } from "typeorm";
import { User } from "../../models/user";
import { UserGroup } from "../../models/user-group";
import { Scopes } from "../../models/scope";
import { ScopeGroup } from "../../models/scope-group";
import { Client } from "../../models/client";
import { Oauth } from "../../models/oauth";
import { ClientRedirectURI } from "../../models/redirect-uris";
import "reflect-metadata";
import AWS from "aws-sdk";
import { DbConnectionError } from "../../types/response_types";


export async function auroraConnectApi(): Promise<any> {
    try {
        try {
            const connection = getConnection();
            return connection;
        }
        catch (e) {
            const cf = new AWS.CloudFormation({ region: process.env.REGION });
            const listExports = await cf.listExports().promise();
            const dbSecretARN = listExports.Exports
                .filter((item) => { return item.Name === process.env.DB_SECRET_ARN_EXPORT_NAME });
            const resourceSecretARN = listExports.Exports
                .filter((item) => { return item.Name === process.env.DB_CLUSTER_ARN_EXPORT_NAME });

            const connection = await createConnection({
                type: 'aurora-data-api',
                name: 'default',
                database: process.env.NODE_ENV == 'test' ? process.env.DB_NAME + "_test" : process.env.DB_NAME,
                dropSchema: process.env.NODE_ENV == 'test' ? true : false,
                secretArn: dbSecretARN[0].Value,
                resourceArn: resourceSecretARN[0].Value,
                region: process.env.REGION,
                entities: [User, Scopes, ScopeGroup, Client, ClientRedirectURI, UserGroup, Oauth],
                synchronize: true,
                logging: false
            });
            return connection;
        }
    }
    catch (e) {
        throw new DbConnectionError('Aurroa API Connect Error: Generally this is cause by Aoura Auto Pause', 500, e);
    }
}

