export interface MedicalReport {
  _id: string;
  patientId: string;
  visitId?: string;
  blobPath: string;
  checksum: string;
  uploader: string;
  createdAt: Date;
}
