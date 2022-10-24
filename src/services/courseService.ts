import { db } from './firebase';
import type { NewCourse } from 'src/types/course';
import { collection, addDoc } from 'firebase/firestore';

// const fetchCourses = (courseId: number) => {};
const postCourse = async (newCourse: NewCourse) => {
  // Add a new document with a generated id.
  console.log('in postCourse');
  const coursesCol = collection(db, 'courses');
  console.log(coursesCol);
  return await addDoc(collection(db, 'courses'), newCourse);
};

export default {
  postCourse,
  //   fetchCourses,
};
