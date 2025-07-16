const nodemailer = require("nodemailer");
const { logger } = require("./utils");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // or your SMTP host
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

const sendNewRegistrationMail = async (email, name, userId, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Login Details - Code Tracker",
    html: `
      <h2>Welcome to Code Tracker!</h2>
      <p>Dear ${name},</p>
      <p>Your registration has been successful. Here are your login details:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p>Please keep these credentials safe and change your password after first login.</p>
      <p>Best regards,<br>Code Tracker Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Login details email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send email to ${email}: ${error.message}`);
  }
};

sendNewRegistrationMail("dev.pavangollapalli@gmail.com", "Pavan Gollapalli", "22A91A6182", "22A91A6182")