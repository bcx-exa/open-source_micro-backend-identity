import { createConnection, getConnection } from "typeorm";
//import { DbConnectionError } from "../handlers/error-handling";
import { User } from "../../models/user";
import { UserGroup } from "../../models/user-group";
import { Scopes } from "../../models/scope";
import { ScopeGroup } from "../../models/scope-group";
import { Client } from "../../models/client"; 
import "reflect-metadata";
import AWS from "aws-sdk";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function auroraConnectApi(): Promise<any> {
    try {
        try {
            const connection = getConnection();
            return connection;
        } 
        catch(e) {
            const cf = new AWS.CloudFormation({ region: process.env.REGION });
            const listExports = await cf.listExports().promise();
            const dbSecretARN = listExports.Exports
                .filter((item) => { return item.Name === process.env.DB_SECRET_ARN_EXPORT_NAME });
            const resourceSecretARN = listExports.Exports
                .filter((item) => { return item.Name === process.env.DB_CLUSTER_ARN_EXPORT_NAME });

            const connection = await createConnection({
                type: 'aurora-data-api',
                name: 'default',
                database: process.env.DB_NAME,
                secretArn:dbSecretARN[0].Value,
                resourceArn: resourceSecretARN[0].Value,
                region: process.env.REGION,
                entities: [User, Scopes, ScopeGroup, UserGroup, Client],
                synchronize: true,
                logging: false
            });

            return connection;
        }
    } 
    catch (e) {
        console.error('Aurroa API Connect Error: Generally this is cause by Aoura Auto Pause. Waiting for DB to start, trying again in 20 seconds!');
        await sleep(10000);
        const connection = getConnection();
        await connection.synchronize();
        await auroraConnectApi();
    }
}

