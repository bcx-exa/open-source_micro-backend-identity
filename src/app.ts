import { APIGatewayProxyHandler } from 'aws-lambda';
import serverless from 'serverless-http';
import 'source-map-support/register';
import { Server } from './server'

// Get configured Express App
const expressApp = new Server();
expressApp.Start();

// Export express App into serverless to be deployed in AWS
export const app_bundle: APIGatewayProxyHandler = serverless(expressApp.httpServer);



  
