import { SMSPort } from "./sms.port.js";
import twilio from "twilio";

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  throw new Error("Missing Twilio environment variables");
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID as string,
  process.env.TWILIO_AUTH_TOKEN as string
);

export const smsAdapter: SMSPort = {
  async send(to: string, text: string): Promise<void> {
    console.log(`=== Sending SMS to ${to} with text: "${text}"`);
    try {
      const message = await client.messages.create({
        body: text,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      });

      console.log(`=== SMS sent successfully! SID: ${message.sid}`);
    } catch (error: any) {
      console.error(`=== Error sending SMS: ${error.message || error}`);
    }
  },
};
