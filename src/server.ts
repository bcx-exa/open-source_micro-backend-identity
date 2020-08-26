import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { execShellCommand } from './helpers/shell';
import xrayExpress from 'aws-xray-sdk-express';
import dotenv from 'dotenv-flow';
import { credsConfigLocal } from './middelware/aws/auth';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import passport from 'passport';
import { genKeyPair } from './helpers/crypto'
import { authenticateUser } from './middelware/passport/passport-jwt';
import { ValidateError } from 'tsoa';
import { ApiError } from './helpers/error-handling'

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
    
    //Allow Cors
    this.httpServer.use(cors());

    //Add Passport Middelware to all routes
    authenticateUser(passport);
    this.httpServer.use(passport.initialize());



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

    this.httpServer.use(function errorHandler(
      err: unknown,
      req: Request,
      res: Response
    ): Response | void {
      if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
          message: "Validation Failed",
          details: err?.fields,
        });
      }
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
          name: err.name,
          message: err.message,
        });
      }
      if (err instanceof Error) {
        return res.status(500).json({
          name: err.name,
          message: "Internal Server Error",
        });
      }
    });

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
