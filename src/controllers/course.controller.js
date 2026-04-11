import * as courseService from "../services/course.service.js";

export const getAllCourses = async (req, res) => {
         try {
                  const Limit = req.query.limit || 7;
                  const Offset = req.query.offset || 0;
                  const courses = await courseService.getAllCourses(Limit, Offset);
                  res.status(200).json(courses);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};


export const getCourseById = async (req, res) => {
         try {
                  const course = await courseService.getCourseById(req.params.id);
                  res.status(200).json(course);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};
export const getCourseByCategory = async (req, res) => {
         try {
                  const Limit = req.query.limit || 7;
                  const Offset = req.query.offset || 0;
                  const course = await courseService.getCourseByCategory(Limit, Offset, req.query.category);
                  res.status(200).json(course);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};


export const getCourseBySearch = async (req, res) => {
         try {
                  const Limit = req.query.limit || 7;
                  const Offset = req.query.offset || 0;
                  const course = await courseService.getCourseSearch(Limit, Offset, req.query.q);
                  res.status(200).json(course);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};

export const createCourse = async (req, res) => {
         try {
                  const { title, description, image,url, category,duration } = req.body;

                  if (!title || !description || !image || !url || !category || !duration) {
                           return res.status(400).json({ message: "All fields are required" });
                  }
                  const course = await courseService.createCourse({
                           title,
                           description,
                           image,
                           url,
                           category,
                           duration

                  });
                  res.status(201).json(course);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};


export const deleteCourse = async (req, res) => {
         try {
                  const course = await courseService.deleteCourse(req.params.id);
                  res.status(200).json(course);
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};