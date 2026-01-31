import sgMail from '@sendgrid/mail';
const sendgridApiKey = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(sendgridApiKey);
export const twilioMailAdapter = {
    async send(to, templateId, payload) {
        const msg = {
            to, // Change to your recipient
            from: process.env.SENDGRID_VERIFIED_SENDER, // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: `<strong>Your OTP code is: ${payload.otp}</strong>`,
        };
        try {
            await sgMail.send(msg);
            console.log('Email sent');
        }
        catch (error) {
            console.error(error);
        }
    }
};
