import {
  BlobServiceClient,
  StorageSharedKeyCredential
} from "@azure/storage-blob";
import { env } from "./env.js";

const accountName = env.AZURE_STORAGE_ACCOUNT_NAME!;
const accountKey = env.AZURE_STORAGE_ACCOUNT_KEY!;
export const containerName = env.AZURE_STORAGE_CONTAINER_NAME!;

export const sharedKeyCredential =
  new StorageSharedKeyCredential(accountName, accountKey);

export const blobServiceClient =
  new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );

export const storageAccountName = accountName;