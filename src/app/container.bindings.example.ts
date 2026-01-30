import { register, token } from './container.js';
import { OTPRepoPort } from '../modules/auth/application/ports/OTPRepoPort.js';
import { OTPRepoMongo } from '../modules/auth/infrastructure/repos/OTPRepoMongo.js';
export const OTP_REPO = token<OTPRepoPort>('OTP_REPO');

export function bindAll() {
  register(OTP_REPO, OTPRepoMongo);
}
