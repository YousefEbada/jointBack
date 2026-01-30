import { Request, Response } from 'express';
import { CreateFullUserSchema, CreatePartialUserSchema, FindUserSchema, RequestOtpSchema, VerifyOtpSchema } from '../validators/auth.schemas.js';
import { RequestOtp } from '../../application/use-cases/RequestOtp.js';
import { VerifyOtp } from '../../application/use-cases/VerifyOtp.js';
import { FindUserByContact } from '../../application/use-cases/FindUserByContact.js';
import { CreatePartialUser } from '../../application/use-cases/CreatePartialUser.js';
import { CreateFullUser } from '../../application/use-cases/CreateFullUser.js';
import { resolve } from '../../../../app/container.js';
import { MAIL_REPO, OTP_REPO, SMS_REPO } from 'app/container.bindings.js';
import { USER_AUTH_REPO } from 'app/container.bindings.js';

export async function findUser(req: Request, res: Response) {
  try {
    const { contact } = FindUserSchema.parse(req.query);
    console.log("CONTACT:", contact);
    const uc = new FindUserByContact(resolve(USER_AUTH_REPO));
    const result = await uc.exec(contact);
    if (!result.ok) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("Error in findUser controller:", (error as Error).message);
    return res.status(500).json({ ok: false, message: 'Internal Server Error.' });
  }
}

// create partial user
export async function createPartialUser(req: Request, res: Response) {
  const { fullName, gender, birthdate, contact } = CreatePartialUserSchema.parse(req.body);
  const uc = new CreatePartialUser(resolve(USER_AUTH_REPO));
  try {
    const result = await uc.exec(fullName, gender, birthdate, contact);
    if (!result.ok) {
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    console.log("Error in createPartialUser controller:", (error as Error).message);
    return res.status(500).json({ ok: false, message: 'Internal Server Error.' });
  }
}

// create full user
export async function createFullUser(req: Request, res: Response) {
  // use validation schema
  const body = CreateFullUserSchema.parse(req.body);
  const uc = new CreateFullUser(resolve(USER_AUTH_REPO));
  try {
    const result = await uc.exec(body);
    if (!result.ok) {
      return res.status(400).json({ ok: false, message: result.error });
    }
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Error in createFullUser controller:", err.message);
    return res.status(400).json({ ok: false, message: err?.message ?? 'Failed to create full user.' });
  }
}

// request otp
export async function requestOtp(req: Request, res: Response) {
  const { subjectRef, subjectType, contact } = RequestOtpSchema.parse(req.body);
  try {
    const uc = new RequestOtp(resolve(OTP_REPO), resolve(SMS_REPO), resolve(MAIL_REPO));
    const result = await uc.exec(subjectType, subjectRef, contact as string);
    if (!result.ok) {
      return res.status(400).json({ ok: false, message: result.error ?? 'OTP request failed.' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.log("Error in requestOtp controller:", (error as Error).message);
    return res.status(500).json({ ok: false, message: (error as any)?.message ?? 'OTP request failed.' });
  }
}

// verify otp
export async function verifyOtp(req: Request, res: Response) {
  const { otpToken, code } = VerifyOtpSchema.parse(req.body);
  const uc = new VerifyOtp(resolve(OTP_REPO), resolve(USER_AUTH_REPO));
  try {
    const result = await uc.exec(otpToken, code);
    if (result.ok) {
      if ('accessToken' in result && 'refreshToken' in result) {
        // res.cookie('refreshToken', result.refreshToken, {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === 'production',
        //   sameSite: 'strict',
        //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // });
        return res.status(200).json(result);
      }
      console.log("====OTP verified successfullyafkjl;dsjf;f8uoeqr809480298509====.", result);
      return res.status(200).json(result);
    }
    const statusMap: Record<string, number> = { invalid: 401, expired: 400, locked: 429, not_found: 404, invalid_token: 401 };
    const status = result.reason ? (statusMap[result.reason] ?? 400) : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.log("Error in verifyOtp controller:", (error as Error).message);
    return res.status(500).json({ ok: false, message: 'OTP verification failed.' });
  }
}
