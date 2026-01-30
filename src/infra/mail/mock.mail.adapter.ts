import { MailPort } from "./mail.port.js";

export const mailAdapter: MailPort = {
  async send(to: string, templateId: string, payload: Record<string, any>): Promise<void> {
    console.log("[MOCK EMAIL]", { to, templateId, payload });
  }
};