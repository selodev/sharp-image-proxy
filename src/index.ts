import express from "express";
import cors from "./middlewares/cors";
import { AppRoutes } from "./routes";

const PORT = process.env.PORT || 8080;

export class App {
  private readonly _app: express.Application = express();
  private readonly appRoutes: AppRoutes = new AppRoutes();
  port: number;

  public constructor(port: number) {
    this.port = port;
    this.setMiddleware();
    this.setRoutes();
  }

  /**
   * Get Express app
   *
   * @returns {express.Application} Returns Express app
   */
  public get app(): express.Application {
    return this._app;
  }
  private setMiddleware() {
    this.app.use(cors);
  }
  private setRoutes() {
    this.app.use("/", this.appRoutes.router);
  }
  public listen(): void {
    this.app.listen(this.port, () =>
      console.log(`Started on PORT: ${this.port}`)
    );
  }
}

new App(Number(PORT)).listen();
