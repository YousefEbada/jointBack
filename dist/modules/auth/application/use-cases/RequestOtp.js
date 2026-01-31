import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { randomCode, hashValue } from '../../../../shared/utils/crypto.js';
import { detectContactType } from '../../../../shared/utils/detectContactType.js';
import { security } from '../../../../config/security.js';
export class RequestOtp {
    otpRepo;
    smsRepo;
    mailRepo;
    constructor(otpRepo, smsRepo, mailRepo) {
        this.otpRepo = otpRepo;
        this.smsRepo = smsRepo;
        this.mailRepo = mailRepo;
    }
    async exec(subjectType, subjectRef, contact) {
        const otp = await this.createOtp(subjectType, subjectRef);
        const otpToken = this.signJwt({ subjectType, subjectRef });
        const contactType = detectContactType(contact);
        try {
            // const res =
            await this.sendOtp(contactType, subjectType, contact, subjectRef, otp.code);
            // if(!res) {
            //   return { ok: false, error: 'Failed to send OTP' };
            // }
            console.log(`[Request OTP] OTP sent to ${contact} via ${contactType}`);
            return { ok: true, otpToken };
        }
        catch (error) {
            console.log('[Request OTP] Error sending OTP:', error.message);
            return { ok: false, error: error.message };
        }
    }
    // Private helper methods
    async createOtp(subjectType, subjectRef) {
        const code = randomCode(6);
        const codeHash = await hashValue(code);
        const expiresAt = dayjs().add(security.otp.ttlMinutes, 'minute').toDate();
        await this.otpRepo.create({
            _id: randomUUID(),
            subjectType,
            subjectRef,
            codeHash,
            expiresAt,
            attempts: 0,
            status: 'active',
        });
        return { code, expiresAt };
    }
    signJwt(payload) {
        const secret = process.env.JWT_REQUEST_TOKEN_SECRET;
        const expiresIn = security.otp.ttlMinutes * 60;
        return jwt.sign(payload, secret, { expiresIn });
    }
    async sendOtp(contactType, subjectType, contact, subjectRef, code) {
        // Error handling
        if (contactType === 'phone') {
            await this.smsRepo.send(contact, code);
            return;
        }
        if (contactType === 'email') {
            const mailConfig = this.getMailConfig(subjectType, subjectRef, code);
            if (!mailConfig)
                throw new Error('Invalid subjectType for email');
            await this.mailRepo.send(contact, mailConfig.templateId, mailConfig.context);
            return;
        }
        throw new Error('Invalid contact type');
    }
    getMailConfig(subjectType, subjectRef, code) {
        const mailTemplates = {
            login: { templateId: 'login-otp', context: { otp: code } },
            register: { templateId: 'register-otp', context: { otp: code } },
            report: { templateId: 'report-otp', context: { otp: code } },
        };
        return mailTemplates[subjectType] || null;
    }
}
