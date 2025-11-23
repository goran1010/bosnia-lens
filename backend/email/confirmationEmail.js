import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendConfirmationEmail(
  userEmail,
  userName,
  confirmationLink,
) {
  try {
    const email = await resend.emails.send({
      from: "Bosnia Lens <onboarding@resend.dev>",
      to: [userEmail],
      subject: "Confirm Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome, ${userName}!</h2>
          <p>Thank you for registering. Please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirm Email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${confirmationLink}">${confirmationLink}</a>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
    });

    // eslint-disable-next-line no-console
    console.log("Email sent:", email.data);
    return { success: true, messageId: email.data };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}
