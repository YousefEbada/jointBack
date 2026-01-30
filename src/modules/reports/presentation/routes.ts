import { Router } from 'express';
import { uploadReport, getReportLink } from './controllers/reports.controller.js';
import { validate } from '../../../shared/middleware/validate.js';
import { UploadReportSchema } from './validators/reports.schemas.js';
export const reportRoutes = Router();
reportRoutes.post(
    '/upload',
    validate({ body: UploadReportSchema }),
    uploadReport
);
reportRoutes.get('/:id/link', getReportLink);
