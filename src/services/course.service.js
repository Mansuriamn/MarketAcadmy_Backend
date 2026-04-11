import Course from "../models/CourseModel.js";

export const getAllCourses = async (limit, offset) => {
         const courses = await Course.find()
         .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();
         return courses;
};

export const getCourseById = async (id) => {
     
         const course = await Course.findById(id);
        
         return course;
};
export const getCourseByCategory = async (limit, offset, category) => {
         const course = await Course.find({ category: category })
         .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();
         return course;
};
export const getCourseSearch = async (limit, offset, q) => {
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
      
   
       const blogs = await Course.find(query)
         .sort({ createdAt: -1 })
         .skip(numOffset)   // ✅ guaranteed number
         .limit(numLimit)   // ✅ guaranteed number
         .lean();
   
       return blogs;
   
     } catch (err) {
       console.error('→ getBlogSearch CRASH:', err);
       throw err;
     }
}

export const createCourse = async (courseData) => {
         const course = await Course.create(courseData);
         return course;
};

export const deleteCourse = async (id) => {
         const course = await Course.findByIdAndDelete(id);
         return course;
};

