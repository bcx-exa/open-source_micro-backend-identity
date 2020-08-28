import { createConnection } from "typeorm";
import * as t1 from "../models/identity";
import { v4 as uuidv4 } from 'uuid';
import "reflect-metadata";
import AWS from "aws-sdk";
import { ApiError } from "./error-handling";

export async function getAuroraCreds(): Promise<any> {
    const client = new AWS.SecretsManager({ region: process.env.REGION });
    const result = await client.getSecretValue({SecretId: process.env.DB_USERNAME}).promise();

    JSON.parse(result.SecretString);

    const finalResult = {
        username: JSON.parse(result.SecretString).username,
        password: JSON.parse(result.SecretString).password,
    }

    return finalResult;
}
export async function auroraConnectMySql(): Promise<any> {
try {
    const getLoginInfo = await getAuroraCreds();
    const username = getLoginInfo.username
    const password = getLoginInfo.password;

    const cf = new AWS.CloudFormation({ region: process.env.REGION });
    const listExports = await cf.listExports().promise();
    const endpointAddress = listExports.Exports.filter((item) => { return item.Name === process.env.DB_ENDPOINT_ADDRESS_EXPORT_NAME });

    const auroraConnectMySql = await createConnection({
        type: "mysql",
        name: 'typeorm-sql-connection-' + uuidv4(),
        host: endpointAddress[0].Value,
        port: 3306,
        username: username,
        password: password,
        database: process.env.DB_NAME,
        entities: [
            t1.UserProfile
        ],
        synchronize: true,
        logging: false
    });

    return auroraConnectMySql;
} catch(e) {
    throw new ApiError('Aurroa MySql Connectt Error', 500, e);
}
}
export async function auroraConnectApi(): Promise<any> {
    try {
        const cf = new AWS.CloudFormation({ region: process.env.REGION });
        const listExports = await cf.listExports().promise();
        const dbSecretARN = listExports.Exports.filter((item) => { return item.Name === process.env.DB_SECRET_ARN_EXPORT_NAME });
        const resourceSecretARN = listExports.Exports.filter((item) => { return item.Name === process.env.DB_CLUSTER_ARN_EXPORT_NAME });

        const auroraConnectApi = await createConnection({
            type: 'aurora-data-api',
            name: 'default',
            database: process.env.DB_NAME,
            secretArn:dbSecretARN[0].Value,
            resourceArn: resourceSecretARN[0].Value,
            region: process.env.REGION,
            entities: [
                t1.UserProfile
            ],
            synchronize: true,
            logging: false
        });

        return auroraConnectApi;
    } catch(e) {
        throw new ApiError('Aurroa Api Connect Error', 500, e);
    }
}

