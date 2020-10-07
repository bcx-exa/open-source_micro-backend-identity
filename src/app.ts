import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import serverless from "serverless-http";
import "source-map-support/register";
import { Server } from "./server";
import request from "supertest";

// Get configured Express App
const expressApp = new Server();

try {
  expressApp.Start();
} catch (e) {
  console.error(e);
}
// Export express App into serverless to be deployed in AWS
export const app_bundle: APIGatewayProxyHandlerV2 = serverless(
  expressApp.app
);
