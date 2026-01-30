export interface MailPort {
  send(to: string, templateId: string, payload: Record<string, any>): Promise<void>;
}
