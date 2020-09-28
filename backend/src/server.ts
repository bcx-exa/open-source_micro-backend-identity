/* eslint-disable */
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
import cookieParser from "cookie-parser";
import ejs from 'ejs';
import { registerStrategies } from "./middelware/passport/passport";
import { globalErrorHandler } from "./components/handlers/error-handling";

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

      //Configure AWS Creds
      if (env == 'local') {
        credsConfigLocal();
      }

      this.httpServer.engine('ejs', ejs.__express);
      this.httpServer.set('view engine', 'ejs');
      this.httpServer.set('views', path.join(__dirname, './views'));
      this.httpServer.use(cookieParser());
      
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
      }
      
      //Register tsoa routes
      const routesTSOA = await import("./middelware/tsoa/routes");
      routesTSOA.RegisterRoutes(this.httpServer);

      //Swagger-UI
      this.httpServer.use('/api-docs', swaggerUi.serve, async (_req: Request, res: Response) => {
        return res.send(swaggerUi.generateHTML(await import("./middelware/tsoa/swagger.json")));
      });

      //login
      this.httpServer.get('/login', (_req, res) => {
        res.send('Login Page');
      });

      //Home
      this.httpServer.get('/home', (_req, res) => {
        res.send('you have been logged in!');
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
