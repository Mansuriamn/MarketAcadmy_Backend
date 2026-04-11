import {
  createEmailService,
  getAllEmailsService,
} from "../services/email.service.js";

// 🔹 Create Email
export const createEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await createEmailService(email);

    return res.status(201).json({
      success: true,
      message: "Email subscribed successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// 🔹 Get All Emails
export const getAllEmails = async (req, res) => {
  try {
    const emails = await getAllEmailsService();

    return res.status(200).json({
      success: true,
      count: emails.length,
      data: emails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};