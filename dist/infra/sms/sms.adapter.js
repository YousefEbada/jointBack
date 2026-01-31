import twilio from "twilio";
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    throw new Error("Missing Twilio environment variables");
}
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export const smsAdapter = {
    async send(to, text) {
        console.log(`=== Sending SMS to ${to} with text: "${text}"`);
        try {
            const message = await client.messages.create({
                body: text,
                to,
                from: process.env.TWILIO_PHONE_NUMBER,
            });
            console.log(`=== SMS sent successfully! SID: ${message.sid}`);
        }
        catch (error) {
            console.error(`=== Error sending SMS: ${error.message || error}`);
        }
    },
};
