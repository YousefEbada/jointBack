import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { OTPRepoPort } from '../ports/OTPRepoPort.js';
import { SMSPort } from 'infra/sms/sms.port.js';
import { MailPort } from 'infra/mail/mail.port.js';
import { randomCode, hashValue } from '../../../../shared/utils/crypto.js';
import { detectContactType } from '../../../../shared/utils/detectContactType.js';
import { security } from '../../../../config/security.js';

type SubjectType = 'report' | 'login' | 'register';

export class RequestOtp {
  constructor(
    private otpRepo: OTPRepoPort,
    private smsRepo: SMSPort,
    private mailRepo: MailPort
  ) { }

  async exec(subjectType: SubjectType, subjectRef: string, contact: string) {
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
    } catch (error) {
      console.log('[Request OTP] Error sending OTP:', (error as Error).message);
      return { ok: false, error: (error as Error).message };
    }
  }

  // Private helper methods

  private async createOtp(subjectType: SubjectType, subjectRef: string) {
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

  private signJwt(payload: Record<string, string>) {
    const secret = process.env.JWT_REQUEST_TOKEN_SECRET as string;
    const expiresIn = security.otp.ttlMinutes * 60;
    return jwt.sign(payload, secret, { expiresIn });
  }

  private async sendOtp(
    contactType: string,
    subjectType: SubjectType,
    contact: string,
    subjectRef: string,
    code: string
  ) {
    // Error handling
    if (contactType === 'phone') {
      await this.smsRepo.send(contact, code);
      return;
    }

    if (contactType === 'email') {
      const mailConfig = this.getMailConfig(subjectType, subjectRef, code);
      if (!mailConfig) throw new Error('Invalid subjectType for email');
      await this.mailRepo.send(contact, mailConfig.templateId, mailConfig.context);
      return;
    }

    throw new Error('Invalid contact type');
  }

  private getMailConfig(subjectType: string, subjectRef: string, code: string) {
    const mailTemplates: Record<
      string,
      { templateId: string; context: Record<string, any> }
    > = {
      login: { templateId: 'login-otp', context: { otp: code } },
      register: { templateId: 'register-otp', context: { otp: code } },
      report: { templateId: 'report-otp', context: { otp: code } },
    };

    return mailTemplates[subjectType] || null;
  }
}
