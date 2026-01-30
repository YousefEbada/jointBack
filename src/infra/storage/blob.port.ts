export interface BlobPort {
  upload(p_path: string, bytes: Uint8Array, contentType: string): Promise<string>;
  signedUrl(path: string, ttlSeconds: number): Promise<string>;
}
