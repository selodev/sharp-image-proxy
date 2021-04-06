import * as express from "express";
import fetch from "node-fetch";
import * as sharp from "sharp";

const PORT = process.env.PORT || 8080;
const ALLOWED_HOST = process.env.ALLOWED_HOST || 'http://localhost:3333';
const app = express();

const fetchImage = async (url: string) => {
  try {
    const fetchReq = await fetch(url, { method: "GET" });

    let format = url.split(".").pop();
    if (
      fetchReq.headers.has("content-type") &&
      fetchReq.headers.get("content-type").startsWith("image/")
    ) {
      format = fetchReq.headers.get("content-type").replace("image/", "");
    }

    return {
      status: fetchReq.status,
      buffer: await fetchReq.buffer(),
      format: format,
    };
  } catch (e) {
    return { status: 500 };
  }
};
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3333"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app
  .get("/", async (req, res) => {
    if (!(req.query.url && req.query.url.toString().includes("://"))) {
      res.status(400).send("URL is required");
      return;
    }

    if (
      req.query.url &&
      ALLOWED_HOST &&
      ALLOWED_HOST.length > 0 &&
      new URL(req.query.url.toString()).host !== ALLOWED_HOST
    ) {
      res.status(400).send("image host not allowed");
      return;
    }

    const url = req.query.url.toString();
    const quality = req.query.quality
      ? parseInt(req.query.quality.toString())
      : 100;
    const image = await fetchImage(url);

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
    width = width && (await pipeline.metadata()).width >= width ? width : null;
    height =
      height && (await pipeline.metadata()).height >= height ? height : null;

    if (width || height) {
      pipeline.resize(width, height, { fit: "outside" });
    }

    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.setHeader("Content-Type", "image/" + format);
    pipeline.toFormat(toFormat as any, {
      quality: quality,
      compression: compression,
    });
    pipeline.toBuffer((_, buffer) => res.end(buffer, "binary"));
  })
  .listen(PORT, () => console.log(`Started on PORT: ${PORT}`));
