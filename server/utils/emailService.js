import nodemailer from 'nodemailer';

// Create a single transporter instance. This is more efficient than creating
// a new one for every email.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  // `secure` should be true if you're using port 465, false for others.
  // This makes the logic a bit more robust.
  secure: parseInt(process.env.EMAIL_PORT, 10) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Private helper to centralize sending logic and error handling
const sendMailWrapper = async (mailOptions, { successMessage, errorMessage }) => {
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(successMessage, result.messageId);
    return result;
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

// Private helper to format attachments consistently
const formatAttachments = (attachments = []) =>
  attachments.map((attachment) => ({
    filename: attachment.filename,
    path: attachment.url,
    contentType: attachment.contentType,
  }));

const FROM_CONFIG = {
  name: 'Complete Solution Technology',
  address: process.env.EMAIL_USER,
};

export const sendEmailNotification = async ({ to, subject, html }) => {
  const mailOptions = {
    from: FROM_CONFIG,
    to,
    subject,
    html,
  };

  return sendMailWrapper(mailOptions, {
    successMessage: 'Email sent successfully:',
    errorMessage: 'Email sending error:',
  });
};

// Send reply email with attachments
export const sendReplyEmail = async ({ to, subject, message, attachments = [], replyTo = null }) => {
  const mailOptions = {
    from: FROM_CONFIG,
    to,
    subject: `Re: ${subject}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">Complete Solution Technology</h2>
            <p style="color: #666; margin: 5px 0 0 0;">Admin Reply</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
            ${message}
          </div>
          
          ${
            replyTo
              ? `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #007bff;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Original Message:</strong><br>
                ${replyTo}
              </p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
            <p>This is an automated response from Complete Solution Technology</p>
            <p>Please do not reply to this email directly</p>
          </div>
        </div>
      `,
    attachments: formatAttachments(attachments),
  };

  return sendMailWrapper(mailOptions, {
    successMessage: 'Reply email sent successfully:',
    errorMessage: 'Reply email sending error:',
  });
};

// Send job application response
export const sendJobApplicationResponse = async ({
  to,
  fullName,
  position,
  message,
  attachments = [],
  status,
}) => {
  const statusMessages = {
    shortlisted: 'Congratulations! Your application has been shortlisted.',
    rejected: 'Thank you for your interest in the position.',
    hired: 'Congratulations! You have been selected for the position.',
    reviewing: 'Your application is currently under review.',
  };

  const mailOptions = {
    from: FROM_CONFIG,
    to,
    subject: `Application Update - ${position}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">Complete Solution Technology</h2>
            <p style="color: #666; margin: 5px 0 0 0;">Job Application Update</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
            <p>Dear ${fullName},</p>
            
            <p>${
              statusMessages[status] ||
              'We have an update regarding your job application.'
            }</p>
            
            ${message ? `<p>${message}</p>` : ''}
            
            <p>Best regards,<br>
            Complete Solution Technology Team</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
            <p>This is an automated response from Complete Solution Technology</p>
            <p>Please do not reply to this email directly</p>
          </div>
        </div>
      `,
    attachments: formatAttachments(attachments),
  };

  return sendMailWrapper(mailOptions, {
    successMessage: 'Job application response sent successfully:',
    errorMessage: 'Job application response sending error:',
  });
};