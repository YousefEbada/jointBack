import { verifyHash } from "../../../../shared/utils/crypto.js";
import { security } from "../../../../config/security.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../../../shared/utils/generateTokens.js";
export class VerifyOtp {
    otpRepo;
    userRepo;
    constructor(otpRepo, userRepo) {
        this.otpRepo = otpRepo;
        this.userRepo = userRepo;
    }
    async exec(otpToken, code) {
        const payload = this.verifyToken(otpToken);
        if (!payload)
            return { ok: false, reason: "invalid_token" };
        const { subjectType, subjectRef } = payload;
        const otp = await this.otpRepo.latest(subjectType, subjectRef);
        if (!otp)
            return { ok: false, reason: "not_found" };
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
    verifyToken(token) {
        try {
            const jwtSecret = process.env.JWT_REQUEST_TOKEN_SECRET;
            return jwt.verify(token, jwtSecret);
        }
        catch {
            return null;
        }
    }
    isExpiredOrInactive(otp) {
        const expired = otp.expiresAt < new Date();
        return otp.status !== "active" || expired;
    }
    isLocked(otp) {
        return otp.attempts >= security.otp.maxAttempts;
    }
    async updateOtpStatus(otp, status) {
        otp.status = status;
        await this.otpRepo.save(otp);
    }
    async handleSubjectType(subjectType, subjectRef) {
        const user = await this.userRepo.findById(subjectRef);
        if (!user)
            return { ok: false, reason: "not_found" };
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
