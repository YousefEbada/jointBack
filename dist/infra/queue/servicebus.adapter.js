export const serviceBusAdapter = {
    async send(topic, payload) {
        console.log('[QUEUE]', topic, payload);
    }
};
