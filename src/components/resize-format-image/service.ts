import { Request } from "express";
import fetch, { Response } from "node-fetch";
import { Sharp } from "sharp";
import { FormatReqQueries, ImageResponse } from "./models";

export class ResizeFormatImageService {
  async fetchImage(url: string): Promise<ImageResponse> {
    try {
      const fetchReq = await fetch(url, { method: "GET" });

      let format = url.split(".").pop();
      const { headers } = await fetchReq;

      const contentType = headers?.get("content-type");

      if (contentType?.startsWith("image/")) {
        format = contentType.replace("image/", "");
      }

      return {
        status: fetchReq.status,
        buffer: await (fetchReq as Response).buffer(),
        format: format || "",
      };
    } catch (e) {
      return { status: 500 };
    }
  }
  formatReqQueries(req: Request): FormatReqQueries {
    const { url, width, height, format, quality } = req.query;
    return {
      url: url?.toString(),
      width: width ? parseInt(width.toString()) : null,
      height: height ? parseInt(height.toString()) : null,
      format: format?.toString(),
      quality: quality ? parseInt(quality.toString()) : 100,
    };
  }
  async pipelineToFormat(
    pipeline: Sharp,
    format: string,
    quality: number,
    compression: string | undefined
  ): Promise<void> {
    if (format == "avif") {
      await pipeline.toFormat("avif", {
        quality,
        compression,
      });
    }
    if (format == "webp") {
      await pipeline.toFormat("webp", {
        quality,
        compression,
      });
    }
  }
}
