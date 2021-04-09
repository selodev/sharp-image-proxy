import sharp, { Sharp } from "sharp";
import { Request, Response } from "express";
import { ResizeFormatImageService } from "./service";

export class ResizeFormatImageController {
  private readonly service: ResizeFormatImageService;
  private allowedFormats = ["avif", "heif", "webp"];
  constructor() {
    this.service = new ResizeFormatImageService();
    this.get = this.get.bind(this);
  }

  public async get(req: Request, res: Response): Promise<void> {
    const { url, quality, format } = this.service.formatReqQueries(req);
    let { width, height } = this.service.formatReqQueries(req);

    if (!url || !format) {
      res.status(400).send("Qury image url or format is missing");
      return;
    }

    const image = await this.service.fetchImage(url);

    if (image?.status !== 200 && !image?.format) {
      res.status(400).send("Image not found");
      return;
    }

    if (!this.allowedFormats.includes(format)) {
      res.status(400).send("Image format not supported");
      return;
    }
    sharp.cache(false);
    sharp.concurrency(1);
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

      this.service.pipelineToFormat(pipeline, format, quality);

      const { data, info } = await pipeline.toBuffer({
        resolveWithObject: true,
      });
      console.log(data, info);
      pipeline.on("error", (error) => {
        res.status(404).json({ data: error });

        console.error(error);
        return;
      });
      res.json({ data, info });
    } catch (err) {
      console.log(err);
    }
  }
}
