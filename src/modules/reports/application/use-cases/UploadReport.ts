import { ReportRepoPort } from '../ports/ReportRepoPort.js';
import { BlobPort } from '../infra-ports/BlobPort.js';
import { sha256 } from '../../../../shared/utils/crypto.js';
import { randomUUID } from 'node:crypto';

export class UploadReport {
  constructor(private repo: ReportRepoPort, private blob: BlobPort) {}
  async exec(input: { patientId: string; visitId?: string; fileBase64: string; uploader: string; }) {
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
