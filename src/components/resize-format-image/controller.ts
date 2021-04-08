import sharp, { Sharp } from "sharp";
import { Request, Response } from "express";
import { ResizeFormatImageService } from "./service";

export class ResizeFormatImageController {
  private readonly service: ResizeFormatImageService;
  constructor() {
    this.service = new ResizeFormatImageService();
    this.get = this.get.bind(this);
  }

  public async get(req: Request, res: Response): Promise<void> {
    const { url, quality } = this.service.formatReqQueries(req);
    let { width, height, format } = this.service.formatReqQueries(req);

    if (!url) {
      res.status(400).send("Image url is missing");
      return;
    }

    const image = await this.service.fetchImage(url);

    if (image?.status !== 200 && !image?.format) {
      res.status(400).send("Image not found");
      return;
    }

    const allowedFormats = ["avif", "heif", "webp"];
    format = format ?? image?.format ?? "";
    format = format === "avif" ? "heif" : format;
    if (!allowedFormats.includes(format)) {
      console.log(image.format, format);

      res.status(400).send("Image format not supported");
      return;
    }

    const toFormat = allowedFormats.includes(format) ? format : "jpg";
    console.log(toFormat);
    const compression = format === "avif" ? "av1" : undefined;

    try {
      const pipeline: Sharp = sharp(image.buffer);
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
      this.service.pipelineToFormat(pipeline, toFormat, quality, compression);

      pipeline.toBuffer((err, buffer) => {
        console.log(err);
        res.end(buffer, "binary");
      });
    } catch (err) {
      console.log(err);
    }
  }
}
