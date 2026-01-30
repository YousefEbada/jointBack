import { Request, Response } from 'express';
import { resolve, token } from '../../../../app/container.js';
import { UploadReport } from '../../application/use-cases/UploadReport.js';
import { GenerateReportLink } from '../../application/use-cases/GenerateReportLink.js';
import type { ReportRepoPort } from '../../application/ports/ReportRepoPort.js';
import type { BlobPort } from '../../application/infra-ports/BlobPort.js';
import { logger } from '../../../../shared/logger/index.js';

const REPORT_REPO = token<ReportRepoPort>('REPORT_REPO');
const BLOB_PORT = token<BlobPort>('BLOB_PORT');

export async function uploadReport(req: Request, res: Response) {
  // now no need to parse the body after made the validation middleware NOTE:(under TEST)
  // const { patientId, visitId, fileBase64 } = UploadReportSchema.parse(req.body);
  const { patientId, visitId, fileBase64 } = req.body;
  const uc = new UploadReport(resolve(REPORT_REPO), resolve(BLOB_PORT));
  const report = await uc.exec({ patientId, visitId, fileBase64, uploader: (req as any).user?.id || 'doctor:unknown' });
  res.status(201).json(report);
}

export async function getReportLink(req: Request, res: Response) {
  const id = req.params.id;
  const uc = new GenerateReportLink(resolve(REPORT_REPO), resolve(BLOB_PORT));
  const link = await uc.exec(id);

  logger.info({
    audit: 'report_link_requested',
    reportId: id,
    by: (req as any).user?.id || 'anonymous',
    ip: req.ip,
    traceId: (req as any).traceId,
    at: new Date().toISOString()
  });

  res.json(link);
}
