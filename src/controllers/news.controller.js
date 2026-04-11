import * as newsService from "../services/news.service.js";
import cloudinary from "../config/cloudinary.js";  // ← ADD THIS

export const getAllNews = async (req, res) => {
         try {
                  const Limit=req.query.limit||7;
                  const Offset=req.query.offset||0;
                  const news = await newsService.getAllNews(Limit,Offset);
                  res.status(200).json(news);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};

export const getNewsById = async (req, res) => {
         try {
                  const news = await newsService.getNewsById(req.params.id);
                  res.status(200).json(news);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};
export const getNewsByCategory = async (req, res) => {
         try {
                  const Limit=req.query.limit||7;
                  const Offset=req.query.offset||0;
                  const news = await newsService.getNewsByCategory(Limit,Offset,req.query.category);
                  res.status(200).json(news);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};
export const getNewsBySearch = async (req, res) => {
         try {
                  const Limit=req.query.limit||7;
                  const Offset=req.query.offset||0;
                  const news = await newsService.getNewsSearch(Limit,Offset,req.query.q);
                  res.status(200).json(news);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
}

export const createNews = async (req, res) => {
  try {
    const { title, description,  image, category} = req.body;

    if (!title || !description  || !image || !category ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const news = await newsService.createNews({
      title,
      description,
      image,
      category,
    
    });
    

    return res.status(201).json(news);

  } catch (error) {
    console.error("Create News Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteNews = async (req, res) => {
         try {
                  const news = await newsService.deleteNews(req.params.id);
                  res.status(200).json(news);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};

