import { ReportRepoPort } from '../ports/ReportRepoPort.js';
import { BlobPort } from '../infra-ports/BlobPort.js';

export class GenerateReportLink {
  constructor(private repo: ReportRepoPort, private blob: BlobPort) {}
  async exec(id: string) {
    const doc = await this.repo.findById(id);
    if (!doc) throw Object.assign(new Error('NOT_FOUND'), { status: 404, code: 'NOT_FOUND' });
    const url = await this.blob.signedUrl(doc.blobPath, 600);
    return { url };
  }
}
