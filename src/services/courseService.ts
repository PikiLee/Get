import { NewCourse, Course } from './../types/course';
import { db } from './firebase';
import { collection, addDoc, getDoc, getDocs, query } from 'firebase/firestore';
import { useCourseStore } from 'src/stores/courseStore';

const courseStore = useCourseStore();

const fetchCourses = async () => {
  try {
    const q = query(collection(db, 'courses'));

    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      courses.push({ ...doc.data(), id: doc.id });
    });
    courseStore.courses = courses;
  } catch (err) {
    throw err;
  }
};

const postCourse = (newCourse: NewCourse) => {
  // Add a new document with a generated id.
  return addDoc(collection(db, 'courses'), newCourse)
    .then((docRef) => {
      return getDoc(docRef);
    })
    .then((docSnap) => {
      if (docSnap.exists()) {
        const data = { ...docSnap.data(), id: docSnap.id } as Course;
        courseStore.addNewCourse(data);
      }
    });
};

export default {
  postCourse,
  fetchCourses,
};
