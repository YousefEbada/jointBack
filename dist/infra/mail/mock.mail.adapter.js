export const mailAdapter = {
    async send(to, templateId, payload) {
        console.log("[MOCK EMAIL]", { to, templateId, payload });
    }
};
