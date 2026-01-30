import { OTP } from '../../domain/OTP.js';
export interface OTPRepoPort {
  create(otp: Omit<OTP,'_id'> & { _id: string }): Promise<OTP>;
  latest(subjectType: OTP['subjectType'], subjectRef: string): Promise<OTP | null>;
  save(otp: OTP): Promise<void>;
}
