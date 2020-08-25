import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { execShellCommand } from './middelware/terminal/shell';
import xrayExpress from 'aws-xray-sdk-express';
import dotenv from 'dotenv-flow';
import { credsConfigLocal } from './middelware/aws/auth';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import passport from 'passport';
import { genKeyPair } from './helpers/crypto'

export class Server {
  public httpServer: any

  constructor() {
    //Express and body Parser
    this.httpServer = express();
    this.httpServer.use(bodyParser.urlencoded({ extended: true }));
    this.httpServer.use(bodyParser.json());
  }

  public async Start(): Promise<void> {
    //Generate key pairs if it doesn't exist
    const privKeyExist = path.resolve(process.cwd(), 'src/crypto-keys/priv.pem');
    if (!fs.existsSync(privKeyExist)) genKeyPair();
    
    //Import env variables
    dotenv.config({ path: path.resolve(process.cwd(), './environments/') });
    const env = process.env.NODE_ENV || 'local';
    
    //X-ray Segment Start
    const appName = process.env.APP_NAME || 'micro-base'
    this.httpServer.use(xrayExpress.openSegment(appName + '-startup'));
    
    //Add Passport Middelware to all routes
    // await import('./middelware/passport/passport-jwt');
    // this.httpServer(passport.initialize());

    //Allow Cors
    this.httpServer.use(cors());

    //Generate tsoa routes & spec
    if(env === 'local') {
      await execShellCommand("npm run tsoa");
      credsConfigLocal();
    }

    //Register tsoa routes
    const routes = await import('./middelware/tsoa/routes');
    routes.RegisterRoutes(this.httpServer);

    //X-Ray Segment End
    this.httpServer.use(xrayExpress.closeSegment());

    //Swagger-UI
    this.httpServer.use("", swaggerUi.serve, async (_req: Request, res: Response) => {
      return res.send(
        swaggerUi.generateHTML(await import("./middelware/tsoa/swagger.json"))
      );
    });

    //Start Express Server
    if (env === 'local') {
      const port = process.env.PORT || 5000;
      this.httpServer.listen(port, () => {
        console.log(`Server listening on port http://localhost:${port}`);
      });
    }
  }
}
