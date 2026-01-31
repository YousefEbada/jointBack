import { register, token } from './container.js';
import { OTPRepoMongo } from '../modules/auth/infrastructure/repos/OTPRepoMongo.js';
export const OTP_REPO = token('OTP_REPO');
export function bindAll() {
    register(OTP_REPO, OTPRepoMongo);
}
