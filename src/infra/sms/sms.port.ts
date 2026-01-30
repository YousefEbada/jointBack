export interface SMSPort {
  send(to: string, text: string): Promise<void>;
}
