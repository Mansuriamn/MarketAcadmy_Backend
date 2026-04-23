import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"MarketAcad" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "Your OTP Code - MarketAcad",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0d9488;">OTP Verification</h2>
          <p>Use the code below to verify your email. It is valid for 5 minutes.</p>
          <div style="font-size: 32px; font-weight: bold; color: #1e293b; letter-spacing: 5px; margin: 20px 0;">${otp}</div>
          <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log("✅ OTP Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (toEmail, name = "Trader") => {
  try {
   await transporter.sendMail({
  from: "Nadeem Mansoori | MarketAcad",
  to: toEmail,
  subject: " Start Your Trading Journey with MarketAcad – Limited Access Inside",
  text: `Hello ,

Welcome to MarketAcad!

Your email has been successfully verified.

You now have access to financial guidance by Mr. Nadeem Mansoori (6+ years experience).

Services:
- Stock Market Guidance
- Mutual Funds
- Demat Account
- Algo Trading

Join WhatsApp Group:
https://chat.whatsapp.com/Hcl3srYljmMFnU7aOsMLWH

Contact: +91 9340077499

Start learning. Start growing.`,

  html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px;">
    
    <h2 style="color: #0d9488;"> Welcome</h2>
    <p>Your email has been successfully verified. You’re now part of <b>MarketAcad</b>.</p>

    <p>
      Get guided by <b>Mr. Nadeem Mansoori</b>, a financial expert with <b>6+ years</b> of real market experience.
    </p>

    <h3 style="color: #1e293b; border-bottom: 2px solid #0d9488; padding-bottom: 5px;">
      💼 What You Get:
    </h3>
    <ul>
      <li>📉 Practical Stock Market Guidance</li>
      <li>🏦 Smart Mutual Fund Planning</li>
      <li>📑 Easy Demat Account Setup</li>
      <li>🤖 Algo & Strategy-Based Trading</li>
    </ul>

    <div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0;">
      <p style="margin: 0;"><b>⚡ Why Join?</b></p>
      <p style="margin: 5px 0 0;">
        Most beginners lose money due to lack of guidance.  
        <b>We help you avoid mistakes and grow with confidence.</b>
      </p>
    </div>

    <div style="background: #f0fdfa; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #0d9488; text-align: center;">
      <p style="margin: 0; font-weight: bold; color: #0d9488;">
         Join Our WhatsApp Community
      </p>
      <p style="margin-top: 10px;">
        Get live updates, insights & direct support
      </p>
      <a href="https://chat.whatsapp.com/Hcl3srYljmMFnU7aOsMLWH"
         style="background: #25d366; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-top: 10px;">
         👉 Join Now
      </a>
    </div>

    <p>📞 <b>Contact:</b> +91 9340077499</p>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />

    <p style="font-size: 12px; color: #64748b; text-align: center;">
      Smart traders don’t guess — they learn, plan, and execute.
    </p>
  </div>
  `
});
    console.log("✅ Welcome email sent to:", toEmail);
  } catch (error) {
    console.error("❌ Welcome email failed:", error);
  }
};
