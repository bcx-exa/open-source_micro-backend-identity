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
import session from 'express-session';
import { index, loginForm, login, logout } from './routes/views';
import { authorization, decision, token } from './middelware/passport/passport-oauth2orize';

export class Server {
  public app: any;

  constructor() {
    //Express and body Parser
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
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

      // Initiate view engine
      this.app.engine('ejs', ejs.__express);
      this.app.set('view engine', 'ejs');
      this.app.set('views', path.join(__dirname, './views'));
      this.app.use(cookieParser());
      this.app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

      //Allow Cors
      console.log("Enabling CORS");
      this.app.use(cors());

      //X-ray Segment Start
      console.log("Open X-Ray Segment");
      const appName = process.env.APP_NAME || "micro-base";
      this.app.use(xrayExpress.openSegment(appName + "-startup"));

      //Add Passport Middelware to all routes
      registerStrategies();
      this.app.use(passport.initialize());
      this.app.use(passport.session());

      // API's for oauth test
      this.app.get('/', index);

      // Authentication
      this.app.get('/auth/login', loginForm);
      this.app.post('/auth/login', login);
      this.app.get('/auth/logout', logout);

      // Authorization
      this.app.get('/oauth/authorize', authorization);
      this.app.post('/oauth/decision', decision);
      this.app.post('/oauth/token', token); 
      
      //Generate tsoa routes & spec
      if (env === "local") {
        await execShellCommand("npm run tsoa");
      }
      
      //Register tsoa routes
      const routesTSOA = await import("./middelware/tsoa/routes");
      routesTSOA.RegisterRoutes(this.app);

      //Swagger-UI
      this.app.use('/api-docs', swaggerUi.serve, async (_req: Request, res: Response) => {
        return res.send(swaggerUi.generateHTML(await import("./middelware/tsoa/swagger.json")));
      });

      

      //X-Ray Segment End
      console.log("Ending X-Ray Segment");
      this.app.use(xrayExpress.closeSegment());

      // Global Error handling
      console.log("Adding Global Error Handling");
      this.app.use(globalErrorHandler);

      //Start Express Server
      if (env === "local") {
        const port = process.env.PORT || 5000;
        this.app.listen(port, () => {
          console.log(`Server listening on port http://localhost:${port}`);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
}
