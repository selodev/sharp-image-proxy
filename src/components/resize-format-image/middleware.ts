import { Request, Response, NextFunction } from "express";

export class ResizeFormatImageMiddleware {
  allowedHost: string;
  constructor() {
    this.allowedHost = process.env.ALLOWED_HOST || "";
    this.verifyQueryUrl = this.verifyQueryUrl.bind(this);
  }
  public verifyQueryUrl(req: Request, res: Response, next: NextFunction): void {
    if (!(req.query.url && req.query.url.toString().includes("://"))) {
      res.status(400).send("URL is required");
      return;
    }

    if (
      req.query.url &&
      this.allowedHost &&
      this.allowedHost.length > 0 &&
      new URL(req.query.url.toString()).host !== this.allowedHost
    ) {
      res.status(400).send("image host not allowed");
      return;
    }
    next();
  }
}
