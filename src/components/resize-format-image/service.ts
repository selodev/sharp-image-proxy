import fetch from "node-fetch";

export class ResizeFormatImageService {
  async fetchImage(url: string) {
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
        buffer: await (fetchReq as any).buffer(),
        format: format,
      };
    } catch (e) {
      return { status: 500 };
    }
  }
}
