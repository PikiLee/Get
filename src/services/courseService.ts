import { useUserStore } from './../stores/userStore';
import { NewCourse, Course } from './../types/course';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { useCourseStore } from 'src/stores/courseStore';
import { LoadingBar } from 'quasar';

const courseStore = useCourseStore();

const fetchCourses = async () => {
  try {
    LoadingBar.start();
    const userStore = useUserStore();
    if (!userStore.user) throw Error;
    const q = query(collection(db, 'users', userStore.user.id, 'courses'));

    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      courses.push({ ...doc.data(), id: doc.id } as Course);
    });
    courseStore.courses = courses;
    LoadingBar.stop();
  } catch (err) {
    throw err;
  }
};

const postCourse = (newCourse: NewCourse) => {
  const userStore = useUserStore();

  if (userStore.user) {
    return addDoc(
      collection(db, 'users', userStore.user.id, 'courses'),
      newCourse
    )
      .then((docRef) => {
        return getDoc(docRef);
      })
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = { ...docSnap.data(), id: docSnap.id } as Course;
          courseStore.addNewCourse(data);
        }
      });
  } else {
    return Promise.reject();
  }
};

const updateCourse = async (course: Course) => {
  const userStore = useUserStore();
  if (!userStore.user) return Promise.reject();
  const docRef = doc(db, 'users', userStore.user.id, 'courses', course.id);

  // Set the "capital" field of the city 'DC'
  return await updateDoc(docRef, {
    name: course.name,
    status: course.status,
  });
};

export default {
  postCourse,
  fetchCourses,
  updateCourse,
};
