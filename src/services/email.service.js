import Email from "../models/EmailModel.js";

// 🔹 Create Email
export const createEmailService = async (email) => {
  // check duplicate
  const existing = await Email.findOne({ email });

  if (existing) {
    throw new Error("Email already subscribed");
  }

  const newEmail = await Email.create({ email });

  return newEmail;
};

// 🔹 Get All Emails
export const getAllEmailsService = async () => {
  const emails = await Email.find()
    .sort({ createdAt: -1 }) // latest first
    .lean();

  return emails;
};