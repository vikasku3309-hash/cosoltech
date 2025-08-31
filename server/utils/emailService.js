import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendEmailNotification = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Complete Solution Technology',
        address: process.env.EMAIL_USER
      },
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send reply email with attachments
export const sendReplyEmail = async ({ to, subject, message, attachments = [], replyTo = null }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Complete Solution Technology',
        address: process.env.EMAIL_USER
      },
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
          
          ${replyTo ? `
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
      attachments: attachments.map(attachment => ({
        filename: attachment.filename,
        path: attachment.url,
        contentType: attachment.contentType
      }))
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Reply email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Reply email sending error:', error);
    throw error;
  }
};

// Send job application response
export const sendJobApplicationResponse = async ({ to, fullName, position, message, attachments = [], status }) => {
  try {
    const transporter = createTransporter();
    
    const statusMessages = {
      'shortlisted': 'Congratulations! Your application has been shortlisted.',
      'rejected': 'Thank you for your interest in the position.',
      'hired': 'Congratulations! You have been selected for the position.',
      'reviewing': 'Your application is currently under review.'
    };
    
    const mailOptions = {
      from: {
        name: 'Complete Solution Technology',
        address: process.env.EMAIL_USER
      },
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
            
            <p>${statusMessages[status] || 'We have an update regarding your job application.'}</p>
            
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
      attachments: attachments.map(attachment => ({
        filename: attachment.filename,
        path: attachment.url,
        contentType: attachment.contentType
      }))
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Job application response sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Job application response sending error:', error);
    throw error;
  }
};