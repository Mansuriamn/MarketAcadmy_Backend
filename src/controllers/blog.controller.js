import * as blogService from '../services/blog.service.js';

export const getAllBlogs = async (req, res) => {
  try {
    const Limit = req.query.limit || 7;
    const Offset = req.query.offset || 0;
    const blogs = await blogService.getAllBlogs(Limit, Offset);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getBlogByCategory = async (req, res) => {
  try {
    const Limit = req.query.limit || 7;
    const Offset = req.query.offset || 0;
    const blog = await blogService.getBlogCategory(Limit, Offset, req.query.category);
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// controllers/blogController.js
export const getBlogBySearch = async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 7);  // ✅ number
    const offset = Math.max(0, parseInt(req.query.offset) || 0);  // ✅ number
    const { q } = req.query;

    const blog = await blogService.getBlogSearch(limit, offset, q);
    res.status(200).json(blog);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, description, image, category } = req.body;

    if (!title || !description || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const blog = await blogService.createBlog({
      title,
      description,
      image,
      category,

    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const blog = await blogService.deleteBlog(req.params.id);
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};