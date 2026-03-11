const nodemailer = require("nodemailer");

// ── Reusable transporter (created once, shared across the app) ───────────────
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection on startup
transporter.verify().then(() => {
  console.log("📧 Mail transporter ready");
}).catch((err) => {
  console.error("📧 Mail transporter error:", err.message);
});

/**
 * Send an email via the shared transporter.
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

module.exports = { transporter, sendEmail };
