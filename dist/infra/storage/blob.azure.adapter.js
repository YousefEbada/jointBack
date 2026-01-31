import { v4 as uuidv4 } from "uuid";
import { blobServiceClient, containerName, storageAccountName, sharedKeyCredential } from "../../config/blob.config.js";
import { BlobSASPermissions, generateBlobSASQueryParameters } from "@azure/storage-blob";
export const azureBlobAdapter = {
    async upload(_path, bytes, contentType) {
        const blobName = `${uuidv4()}-${_path}`;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadData(bytes, {
            blobHTTPHeaders: { blobContentType: contentType }
        });
        return blobName;
    },
    async signedUrl(blobName, ttlMinutes) {
        const expiresOn = new Date();
        expiresOn.setMinutes(expiresOn.getMinutes() + ttlMinutes);
        const sasToken = generateBlobSASQueryParameters({
            containerName,
            blobName,
            permissions: BlobSASPermissions.parse("r"),
            expiresOn
        }, sharedKeyCredential).toString();
        return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
    }
};
