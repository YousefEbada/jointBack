import { sha256 } from '../../../../shared/utils/crypto.js';
import { randomUUID } from 'node:crypto';
export class UploadReport {
    repo;
    blob;
    constructor(repo, blob) {
        this.repo = repo;
        this.blob = blob;
    }
    async exec(input) {
        const bytes = Buffer.from(input.fileBase64, 'base64');
        const checksum = sha256(bytes);
        const path = `reports/${input.patientId}/${randomUUID()}.pdf`;
        await this.blob.upload(path, bytes);
        const report = await this.repo.create({
            patientId: input.patientId,
            visitId: input.visitId,
            blobPath: path,
            checksum,
            uploader: input.uploader,
            createdAt: new Date()
        });
        return report;
        // return this.repo.create({ patientId: input.patientId, visitId: input.visitId, blobPath: path, checksum, uploader: input.uploader, createdAt: new Date() });
    }
}
