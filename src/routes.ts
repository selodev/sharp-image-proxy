import { Router } from "express";
import { ResizeFormatImageRoutes } from "./components/resize-format-image/routes";

export class AppRoutes {
  private readonly _router: Router = Router();
  private readonly resizeFormatImageRoutes: ResizeFormatImageRoutes = new ResizeFormatImageRoutes();

  constructor() {
    this.setRoutes();
  }
  public get router(): Router {
    return this._router;
  }
  private setRoutes() {
    this.router.use("/", this.resizeFormatImageRoutes.router);
  }
}
