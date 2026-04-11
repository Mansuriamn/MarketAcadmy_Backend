import Blog from "../models/BlogModel.js";
import Parser from "rss-parser";


const parser = new Parser();


export const getAllBlogs = async ( limit, offset ) => {
         const blogs = await Blog.find()
     .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();
         return blogs;
};

export const getBlogById = async (id) => {
         const blog = await Blog.findById(id);
         return blog;
};
export const getBlogCategory = async (limit, offset, category ) => {
         const blog = await Blog.find({ category: category })
    .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();
         return blog;
};
// services/blogService.js  ← this is a SERVICE, not a controller
// services/blogService.js
export const getBlogSearch = async (limit, offset, q) => {
  try {
    // ✅ Guarantee numbers even if controller forgets to parse
    const numLimit  = Math.max(1, Number(limit)  || 7);
    const numOffset = Math.max(0, Number(offset) || 0);

    let query = {};

    if (q && q.trim().length >= 2) {
      const escaped     = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escaped, 'i');
   
      query = {
        $or: [
          { title:       searchRegex },
          { category:    searchRegex },
          { description: searchRegex },
          { slug:        searchRegex },
        ],
      };
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(numOffset)   // ✅ guaranteed number
      .limit(numLimit)   // ✅ guaranteed number
      .lean();

    return blogs;

  } catch (err) {
    console.error('→ getBlogSearch CRASH:', err);
    throw err;
  }
};

export const createBlog = async (blogData) => {
         const blog = await Blog.create(blogData);
         return blog;
};



export const deleteBlog = async (id) => {
         const blog = await Blog.findByIdAndDelete(id);
         return blog;
};







