export interface QueuePort {
  send(topic: string, payload: any): Promise<void>;
}
