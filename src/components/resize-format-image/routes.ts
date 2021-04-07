import { Router } from "express";
import { ResizeFormatImageController } from "./controller";
import { ResizeFormatImageMiddleware } from "./middleware";

export class ResizeFormatImageRoutes {
  private _router: Router = Router();
  private readonly controller: ResizeFormatImageController = new ResizeFormatImageController();
  private middleware: ResizeFormatImageMiddleware;

  public constructor() {
    this.middleware = new ResizeFormatImageMiddleware();
    this.setRoutes();
  }
  public get router(): Router {
    return this._router;
  }
  private setRoutes() {
    this.router.get(
      "/",
      this.middleware.verifyQueryUrl,
      this.controller.resize
    );
  }
}
