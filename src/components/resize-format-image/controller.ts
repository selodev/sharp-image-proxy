import * as sharp from "sharp";
import { NextFunction, Request, Response } from "express";
import { ResizeFormatImageService } from "./service";

export class ResizeFormatImageController {
  private readonly service: ResizeFormatImageService = new ResizeFormatImageService();

  public async resize(req: Request, res: Response, next: NextFunction) {
    const url = req.query.url.toString();
    const quality = req.query.quality
      ? parseInt(req.query.quality.toString())
      : 100;
    const image = await this.service.fetchImage(url);

    if (image.status !== 200) {
      res.status(400).send("Image not found");
      return;
    }

    const format = req.query.format
      ? req.query.format.toString()
      : image.format;
    const toFormat = format === "avif" ? "heif" : format;
    const compression = format === "avif" ? "av1" : undefined;
    const pipeline = sharp(image.buffer);

    let width = req.query.width ? parseInt(req.query.width.toString()) : null;
    let height = req.query.height
      ? parseInt(req.query.height.toString())
      : null;
    try {
      width =
        width && (await pipeline.metadata()).width >= width ? width : null;
      height =
        height && (await pipeline.metadata()).height >= height ? height : null;

      if (width || height) {
        pipeline.resize(width, height, { fit: "outside" });
      }

      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.setHeader("Content-Type", "image/" + format);

      const formattedFile = await pipeline.toFormat(toFormat as any, {
        quality: quality,
        compression: compression,
      });
      await formattedFile.toFile("./images/img.avif");

      pipeline.toBuffer((err, buffer) => {
        console.log(err);
        res.end(buffer, "binary");
      });
    } catch (err) {
      console.log(err);
    }
  }
}
