import sharp from "sharp";
import { NextFunction, Request, Response } from "express";
import { ResizeFormatImageService } from "./service";

export class ResizeFormatImageController {
  private readonly service: ResizeFormatImageService = new ResizeFormatImageService();

  public async get(req: Request, res: Response, next: NextFunction) {
    let { url, width, height, format, quality } = this.service.formatReqQueries(
      req.query
    );

    if (!url) {
      res.status(400).send("Image url is missing");
      return;
    }

    const image = await this.service.fetchImage(url);

    if (image?.status !== 200 && !image?.format) {
      res.status(400).send("Image not found");
      return;
    }

    format = format ?? image.format;

    const toFormat = format === "avif" ? "heif" : image.format;
    const compression = format === "avif" ? "av1" : undefined;

    try {
      const pipeline = sharp(image.buffer);
      const {
        width: metaDataWidth,
        height: metaDataHeight,
      } = await pipeline.metadata();

      if (metaDataWidth && metaDataHeight) {
        width = width && metaDataWidth >= width ? width : null;
        height = height && metaDataHeight >= height ? height : null;
      }

      if (width || height) {
        pipeline.resize(width, height, { fit: "outside" });
      }

      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.setHeader("Content-Type", "image/" + format);

      const formattedFile = await pipeline.toFormat(toFormat as any, {
        quality,
        compression,
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
