import { Request, Response, NextFunction } from "express";

export default function (_: Request, res: Response, next: NextFunction): void {
  res.set("Access-Control-Allow-Origin", "http://localhost:3333"); // update to match the domain you will make the request from
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}
