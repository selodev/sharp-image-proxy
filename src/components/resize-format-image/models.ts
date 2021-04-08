export interface ImageResponse {
  status: number;
  buffer?: Buffer;
  format?: string;
}

export interface ImageResponseError {
  status: number;
}

export interface FormatReqQueries {
  url: string | undefined;
  width: number | null;
  height: number | null;
  format: string | undefined;
  quality: number;
}
