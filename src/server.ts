import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { execShellCommand } from "./helpers/shell";
import xrayExpress from "aws-xray-sdk-express";
import dotenv from "dotenv-flow";
import { credsConfigLocal } from "./middelware/aws/auth";
import path from "path";
import cors from "cors";
import passport from "passport";
import { registerStrategies } from "./middelware/passport/passport";
import { globalErrorHandler } from "./helpers/error-handling";
import { auroraConnectApi } from "./helpers/aurora";

//import { auroraConnectApi } from './helpers/aurora';

export class Server {
  public httpServer: any;

  constructor() {
    //Express and body Parser
    this.httpServer = express();
    this.httpServer.use(bodyParser.urlencoded({ extended: true }));
    this.httpServer.use(bodyParser.json());
  }

  public async Start(): Promise<void> {
    //Import env variables
    dotenv.config({ path: path.resolve(process.cwd(), "./environments/") });
    const env = process.env.NODE_ENV || "local";

    // Open API connection to aurora serverless
    await auroraConnectApi();

    //Allow Cors
    this.httpServer.use(cors());

    //X-ray Segment Start
    const appName = process.env.APP_NAME || "micro-base";
    this.httpServer.use(xrayExpress.openSegment(appName + "-startup"));

    //Add Passport Middelware to all routes
    registerStrategies();
    this.httpServer.use(passport.initialize());
    this.httpServer.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
    this.httpServer.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/failedlogin" }), function (_req, res) {
      res.redirect("/");
    });

    this.httpServer.get("/auth/facebook", passport.authenticate("facebook"));
    this.httpServer.get("/auth/facebook/callback", passport.authenticate("facebook", { successRedirect: "/", failureRedirect: "/failedlogin" }), function (_req, res) {
      res.redirect("/");
    });

    //Generate tsoa routes & spec
    if (env === "local") {
      await execShellCommand("npm run tsoa");
      credsConfigLocal();
    }

    //Register tsoa routes
    const routes = await import("./middelware/tsoa/routes");
    routes.RegisterRoutes(this.httpServer);

    //X-Ray Segment End
    this.httpServer.use(xrayExpress.closeSegment());

    //Swagger-UI
    this.httpServer.use("", swaggerUi.serve, async (_req: Request, res: Response) => {
      return res.send(swaggerUi.generateHTML(await import("./middelware/tsoa/swagger.json")));
    });

    // Global Error handling
    this.httpServer.use(globalErrorHandler);

    //Start Express Server
    if (env === "local") {
      const port = process.env.PORT || 5000;
      this.httpServer.listen(port, () => {
        console.log(`Server listening on port http://localhost:${port}`);
      });
    }
  }
}
