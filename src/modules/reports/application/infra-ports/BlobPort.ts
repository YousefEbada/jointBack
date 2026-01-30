export interface BlobPort {
  upload(path: string, bytes: Buffer): Promise<{ url: string; etag?: string }>;
  signedUrl(path: string, ttlSeconds: number): Promise<string>;
}
