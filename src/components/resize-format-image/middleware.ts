import { Request, Response, NextFunction } from "express";

export class ResizeFormatImageMiddleware {
  allowedImageHost: string;
  constructor() {
    this.allowedImageHost =
      process.env.ALLOWED_HOST || "isquadrepairsandiego.com";
    this.verifyQueryUrl = this.verifyQueryUrl.bind(this);
  }
  public verifyQueryUrl(req: Request, res: Response, next: NextFunction): void {
    if (!(req.query.url && req.query.url.toString().includes("://"))) {
      res.status(400).send("URL is required");
      return;
    }
    console.log(new URL(req.query.url.toString()).host);
    if (
      req.query.url &&
      this.allowedImageHost &&
      this.allowedImageHost.length > 0 &&
      new URL(req.query.url.toString()).host !== this.allowedImageHost
    ) {
      res.status(400).send("image host not allowed");
      return;
    }
    next();
  }
}
