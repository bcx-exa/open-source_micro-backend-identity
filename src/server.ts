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
// import { auroraConnectApi } from "./components/database/aurora";
// import { issueJWT } from "./components/security/crypto";
// import { profile } from "./types/scopes";

//import { auroraConnectApi } from './components/aurora';

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
      // this.httpServer.get("/auth/google", passport.authenticate("google", { scope: ["openid", "profile", "email"] }));
      // this.httpServer.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/failedlogin" }), async function (_req, res) {
      //   const profileClaims: profile = {
      //     preferred_username: _req.user.preferred_username,
      //     given_name: _req.user.given_name,
      //     family_name: _req.user.family_name,
      //     address: _req.user.address,
      //     created_at: _req.user.created_at,
      //     locale: _req.user.locale,
      //     picture: _req.user.picture,
      //     birthdate: _req.user.birthdate,
      //     updated_at: _req.user.updated_at,
      //   };
      //   res.send(await issueJWT(_req.user.user_id, "7d", false, profileClaims));
      // });

      // this.httpServer.get("/auth/facebook", passport.authenticate("facebook"));
      // this.httpServer.get("/auth/facebook/callback", passport.authenticate("facebook", { successRedirect: "/", failureRedirect: "/failedlogin" }), async function (_req, res) {
      //   const profileClaims: profile = {
      //     preferred_username: _req.user.preferred_username,
      //     given_name: _req.user.given_name,
      //     family_name: _req.user.family_name,
      //     address: _req.user.address,
      //     created_at: _req.user.created_at,
      //     locale: _req.user.locale,
      //     picture: _req.user.picture,
      //     birthdate: _req.user.birthdate,
      //     updated_at: _req.user.updated_at,
      //   };
      //   res.send(await issueJWT(_req.user.user_id, "7d", false, profileClaims));
      // });

      //Generate tsoa routes & spec
      if (env === "local") {
        await execShellCommand("npm run tsoa");
        credsConfigLocal();
      }

      //Register tsoa routes
      const routes = await import("./middelware/tsoa/routes");
      routes.RegisterRoutes(this.httpServer);

      //X-Ray Segment End
      console.log("Ending X-Ray Segment");
      this.httpServer.use(xrayExpress.closeSegment());

      //Swagger-UI
      this.httpServer.use("", swaggerUi.serve, async (_req: Request, res: Response) => {
        return res.send(swaggerUi.generateHTML(await import("./middelware/tsoa/swagger.json")));
      });

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
