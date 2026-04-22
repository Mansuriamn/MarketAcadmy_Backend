import Joi from "joi";

/**
 * Senior Developer Pattern: Schema-based Validation.
 * This prevents corrupt or malicious data from ever reaching the database.
 * Joi provides precise control over data types, lengths, and formats.
 */

export const createBlogSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 5 characters long",
  }),
  description: Joi.string().min(10).required(),
  image: Joi.string().uri().required(),
  category: Joi.string().required(),
  categoryColor: Joi.string().optional(),
});

export const createCourseSchema = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().min(10).required(),
  image: Joi.string().uri().required(),
  url: Joi.string().uri().required(),
  category: Joi.string().required(),
  duration: Joi.string().required(),
});

export const createNewsSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  image: Joi.string().uri().optional(),
  link: Joi.string().uri().required(),
  category: Joi.string().optional(),
});
