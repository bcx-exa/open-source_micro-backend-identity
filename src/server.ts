import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { execShellCommand } from "./components/cli/shell";
import xrayExpress from "aws-xray-sdk-express";
import dotenv from "dotenv-flow";
import { credsConfigLocal } from "./components/security/aws";
import path from "path";
import cors from "cors";
import passport from "passport";
import { registerStrategies } from "./middelware/passport/passport";
import { globalErrorHandler } from "./components/handlers/error-handling";
import { Provider } from 'oidc-provider';
import helmet from 'helmet';
import routes from './middelware/oidc/routes/express';
import configuration from './middelware/oidc/support/configuration';
import set from 'lodash/set';
import Account from './middelware/oidc/support/account';

export class Server {
  public httpServer: any;

  constructor() {
    //Express and body Parser
    this.httpServer = express();
    this.httpServer.use(bodyParser.urlencoded({ extended: true }));
    this.httpServer.use(bodyParser.json());
  }

  public async Start(): Promise<void> {
    try {
      //Import env variables
      console.log("Starting Express Server");
      dotenv.config({ path: path.resolve(process.cwd(), "./environments/") });
      const env = process.env.NODE_ENV || "local";

      //Allow Cors
      console.log("Enabling CORS");
      this.httpServer.use(cors());

      //X-ray Segment Start
      console.log("Open X-Ray Segment");
      const appName = process.env.APP_NAME || "micro-base";
      this.httpServer.use(xrayExpress.openSegment(appName + "-startup"));

      //Add Passport Middelware to all routes
      registerStrategies();
      this.httpServer.use(passport.initialize());

      //Generate tsoa routes & spec
      if (env === "local") {
        await execShellCommand("npm run tsoa");
        credsConfigLocal();
      }
      
      //Register tsoa routes
      const routesTSOA = await import("./middelware/tsoa/routes");
      routesTSOA.RegisterRoutes(this.httpServer);

      // OIDC 
      //const provider = new Provider(`http://localhost:${process.env.PORT}`, { ...configuration } );
      configuration.findAccount = Account.findAccount;
      const provider = new Provider('http://localhost:3000', {  
      clients: [
        {
          client_id: 'development-implicit',
          application_type: 'web',
          token_endpoint_auth_method: 'none',
          response_types: ['id_token'],
          grant_types: ['implicit'],
          redirect_uris: ['http://localhost:3001'], // this fails two regular validations http: and localhost
        },
      ],
    });

      const { invalidate: orig } = provider.Client.Schema.prototype;

      provider.Client.Schema.prototype.invalidate = function invalidate(message, code) {
        if (code === 'implicit-force-https' || code === 'implicit-forbid-localhost') {
          return;
        }

        orig.call(this, message);
      };

      // OIDC Views
      this.httpServer.use(helmet());
      this.httpServer.set('views', path.join(__dirname, 'views'));
      this.httpServer.set('view engine', 'ejs');

      const prod = process.env.NODE_ENV === 'production';

      if (prod) {
        set(configuration, 'cookies.short.secure', true);
        set(configuration, 'cookies.long.secure', true);
      }

      // Add OIDC Routes
      routes(this.httpServer, provider);
      this.httpServer.use('/oidc',provider.callback);

      //Swagger-UI
      this.httpServer.use("/", swaggerUi.serve, async (_req: Request, res: Response) => {
        return res.send(swaggerUi.generateHTML(await import("./middelware/tsoa/swagger.json")));
      });
            
      //X-Ray Segment End
      console.log("Ending X-Ray Segment");
      this.httpServer.use(xrayExpress.closeSegment());

      // Global Error handling
      console.log("Adding Global Error Handling");
      this.httpServer.use(globalErrorHandler);

      //Start Express Server
      if (env === "local") {
        const port = process.env.PORT || 5000;
        this.httpServer.listen(port, () => {
          console.log(`Server listening on port http://localhost:${port}`);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
}
