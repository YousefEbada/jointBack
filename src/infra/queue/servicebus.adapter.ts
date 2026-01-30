import { QueuePort } from './queue.port.js';
export const serviceBusAdapter: QueuePort = {
  async send(topic, payload) {
    console.log('[QUEUE]', topic, payload);
  }
};
