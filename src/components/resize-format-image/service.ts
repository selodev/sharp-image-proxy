import fetch from "node-fetch";

export class ResizeFormatImageService {
  async fetchImage(url: string) {
    try {
      const fetchReq = await fetch(url, { method: "GET" });

      let format = url.split(".").pop();
      const { headers } = await fetchReq;

      let contentType = headers?.get("content-type");

      if (contentType?.startsWith("image/")) {
        format = contentType.replace("image/", "");
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
  formatReqQueries(query: any) {
    let { url, width, height, format, quality } = query;
    return {
      url: url?.toString(),
      width: width && parseInt(width),
      height: height && parseInt(height),
      format: format?.toString(),
      quality: quality ? parseInt(quality) : 100,
    };
  }
}
