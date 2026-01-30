import nodemailer from "nodemailer";
import { MailPort } from "./mail.port.js";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

// Email templates
const emailTemplates: Record<string, { subject: string; getHtml: (payload: any) => string }> = {
  'welcome': {
    subject: 'Welcome to Joint Clinic',
    getHtml: (payload) => `
      <h1>Welcome ${payload.name}!</h1>
      <p>Thank you for joining Joint Clinic. We're excited to have you on board.</p>
      <p>If you have any questions, feel free to reach out to us.</p>
      <hr/>
      <p>
      Joint Clinic<br/>
      Riyadh, Saudi Arabia<br/>
      support@jointclinic.com
      </p>

    `
  },
  'appointment-confirmation': {
    subject: 'Appointment Confirmation',
    getHtml: (payload) => `
      <h1>Appointment Confirmed</h1>
      <p>Dear ${payload.patientName},</p>
      <p>Your appointment has been confirmed for:</p>
      <ul>
        <li><strong>Date:</strong> ${payload.appointmentDate}</li>
        <li><strong>Time:</strong> ${payload.appointmentTime}</li>
        <li><strong>Doctor:</strong> ${payload.doctorName}</li>
      </ul>
      <p>Please arrive 15 minutes early for check-in.</p>
      <hr/>
      <p>
      Joint Clinic<br/>
      Riyadh, Saudi Arabia<br/>
      support@jointclinic.com
      </p>
    `
  },
  'appointment-reminder': {
    subject: 'Appointment Reminder',
    getHtml: (payload) => `
      <h1>Appointment Reminder</h1>
      <p>Dear ${payload.patientName},</p>
      <p>This is a reminder of your upcoming appointment:</p>
      <ul>
        <li><strong>Date:</strong> ${payload.appointmentDate}</li>
        <li><strong>Time:</strong> ${payload.appointmentTime}</li>
        <li><strong>Doctor:</strong> ${payload.doctorName}</li>
      </ul>
      <p>Please arrive 15 minutes early for check-in.</p>
      <hr/>
      <p>
      Joint Clinic<br/>
      Riyadh, Saudi Arabia<br/>
      support@jointclinic.com
      </p>
    `
  },
  'login-otp': {
    subject: 'OTP for Login - Joint Clinic',
    getHtml: (payload) => `
      <h1>Login Verification Code</h1>
      <p>Your login verification code is: <strong>${payload.otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <hr/>
      <p>
      Joint Clinic<br/>
      Riyadh, Saudi Arabia<br/>
      support@jointclinic.com
      </p>
    `
  },
  'register-otp': {
    subject: 'Verify Your Account - Joint Clinic',
    getHtml: (payload) => `
      <h1>Account Verification</h1>
      <p>Welcome to Joint Clinic! Please verify your account with this code:</p>
      <p><strong>${payload.otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <hr/>
      <p>
      Joint Clinic<br/>
      Riyadh, Saudi Arabia<br/>
      support@jointclinic.com
      </p>
    `
  },
  'report-otp': {
    subject: 'OTP to Download Report - Joint Clinic',
    getHtml: (payload) => `
      <h1>Report Download Verification</h1>
      <p>Your verification code to download the report is: <strong>${payload.otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this report, please ignore this email.</p>
      <hr/>
      <p>
      Joint Clinic<br/>
      Riyadh, Saudi Arabia<br/>
      support@jointclinic.com
      </p>
    `
  },
  'otp': {
    subject: 'Your Verification Code',
    getHtml: (payload) => `
      <h1>Verification Code</h1>
      <p>Your verification code is: <strong>${payload.otp}</strong></p>
      <p>This code will expire in ${payload.expiryMinutes || 10} minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <hr/>
      <p>
      Joint Clinic<br/>
      Riyadh, Saudi Arabia<br/>
      support@jointclinic.com
      </p>
    `
  },
  'password-reset': {
    subject: 'Password Reset Request',
    getHtml: (payload) => `
      <h1>Password Reset</h1>
      <p>Dear ${payload.name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${payload.resetLink}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr/>
      <p>
      Joint Clinic<br/>
      Riyadh, Saudi Arabia<br/>
      support@jointclinic.com
      </p>
    `
  }
};

export const NodemailerMailAdapter: MailPort = {
  async send(to: string, templateId: string, payload: Record<string, any>): Promise<void> {
    console.log(`=== Sending email to ${to} with templateId: "${templateId}" and payload:`, payload);

    try {
      // Get the template
      const template = emailTemplates[templateId];
      if (!template) {
        throw new Error(`Email template "${templateId}" not found`);
      }

      // Prepare email options
      const mailOptions = {
        from: `"Joint Clinic" <${process.env.GOOGLE_USER}>`,
        to,
        subject: template.subject,
        html: template.getHtml(payload),
        text: `Your code is: ${payload.otp}`,
      };

      // Send email
      const result = await transporter.sendMail(mailOptions);
      console.log('=== Email sent successfully!', {
        messageId: result.messageId,
        to,
        subject: template.subject
      });

    } catch (error) {
      console.error(`=== Error sending email: ${(error as any).message || error}`);
      throw error; // Re-throw to let the caller handle it
    }
  }
};
