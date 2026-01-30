import { MailPort } from './mail.port.js';
import sgMail, { MailDataRequired } from '@sendgrid/mail';

const sendgridApiKey = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(sendgridApiKey)

export const twilioMailAdapter: MailPort = {
  async send(to, templateId, payload) {
    const msg: MailDataRequired = {
      to, // Change to your recipient
      from: process.env.SENDGRID_VERIFIED_SENDER as string, // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: `<strong>Your OTP code is: ${payload.otp}</strong>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent')
    } catch (error) {
      console.error(error)
    }
  }
};