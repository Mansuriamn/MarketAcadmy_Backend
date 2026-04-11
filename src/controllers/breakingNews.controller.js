import * as breakingNews from "../services/headlineNews.service.js";


export const getHeadlines = async (req, res) => {
         try {
                   const Limit=req.query.limit||7;
                  const Offset=req.query.offset||0;
                  const news = await breakingNews.getBreakingNews(Limit,Offset);
                  res.status(200).json(news);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};
export const createHeadline=async(req,res)=>{
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const news = await breakingNews.createHeadline({
     text
    });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}