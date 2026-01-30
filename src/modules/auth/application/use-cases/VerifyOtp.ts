import { OTPRepoPort } from "../ports/OTPRepoPort.js";
import { verifyHash } from "../../../../shared/utils/crypto.js";
import { security } from "../../../../config/security.js";
import jwt from "jsonwebtoken";
import { UserRepoPort } from "../ports/UserRepoPort.js";
import { generateAccessToken, generateRefreshToken } from "../../../../shared/utils/generateTokens.js";

type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "expired" | "locked" | "not_found" | "invalid_token" | "register OTP unverified" };

  type PayloadToken = {
    subjectType: 'register' | 'login' | 'register';
    subjectRef: string;
  };

export class VerifyOtp {
  constructor(private otpRepo: OTPRepoPort, private userRepo: UserRepoPort) {}

  async exec(otpToken: string, code: string): Promise<VerifyResult> {
    const payload = this.verifyToken(otpToken);
    if (!payload) return { ok: false, reason: "invalid_token" };

    const { subjectType , subjectRef } = payload as PayloadToken;
    const otp = await this.otpRepo.latest(subjectType, subjectRef);
    if (!otp) return { ok: false, reason: "not_found" };

    if (this.isExpiredOrInactive(otp)) {
      await this.updateOtpStatus(otp, "expired");
      return { ok: false, reason: "expired" };
    }

    if (this.isLocked(otp)) {
      await this.updateOtpStatus(otp, "locked");
      return { ok: false, reason: "locked" };
    }

    otp.attempts += 1;
    const isMatch = await verifyHash(otp.codeHash, code);

    if (!isMatch) {
      await this.otpRepo.save(otp);
      return { ok: false, reason: "invalid" };
    }

    await this.updateOtpStatus(otp, "used");
    return this.handleSubjectType(subjectType, subjectRef);
  }

  // Private Helper Methods

  private verifyToken(token: string): { subjectType: string; subjectRef: string } | null {
    try {
      const jwtSecret = process.env.JWT_REQUEST_TOKEN_SECRET as string;
      return jwt.verify(token, jwtSecret) as PayloadToken;
    } catch {
      return null;
    }
  }

  private isExpiredOrInactive(otp: any): boolean {
    const expired = otp.expiresAt < new Date();
    return otp.status !== "active" || expired;
  }

  private isLocked(otp: any): boolean {
    return otp.attempts >= security.otp.maxAttempts;
  }

  private async updateOtpStatus(otp: any, status: "expired" | "locked" | "used"): Promise<void> {
    otp.status = status;
    await this.otpRepo.save(otp);
  }

  private async handleSubjectType(subjectType: string, subjectRef: string): Promise<VerifyResult | any> {
    const user = await this.userRepo.findById(subjectRef);
    if (!user) return { ok: false, reason: "not_found" };

    switch (subjectType) {
      case "register":
        await this.userRepo.updateUserStatus(subjectRef, {
          ...user.userStatus,
          registerOtpVerified: true,
        });
        return { ok: true, message: "Registration OTP verified." };

      case "login":
        if (!user.userStatus?.registerOtpVerified) {
          return { ok: false, reason: "register OTP unverified" };
        }
        const accessToken = generateAccessToken({ userId: subjectRef, userType: user.role });
        const refreshToken = generateRefreshToken({ userId: subjectRef, userType: user.role });
        return { ok: true, accessToken, refreshToken };
        
        // Other types (e.g. "resetPassword", "emailChange", etc.)
      default:
        return { ok: false, reason: "not_found" };
    }
  }
}
