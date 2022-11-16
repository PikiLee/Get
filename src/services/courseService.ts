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
  serverTimestamp,
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
      const course = {
        ...doc.data(),
        id: doc.id,
      } as Course;
      course.createdAt = doc.data().createdAt.toDate();
      courses.push(course);
    });
    courseStore.setCourses(courses);
    LoadingBar.stop();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const postCourse = (newCourse: NewCourse) => {
  const userStore = useUserStore();

  if (userStore.user) {
    LoadingBar.start();
    return addDoc(collection(db, 'users', userStore.user.id, 'courses'), {
      ...newCourse,
      createdAt: serverTimestamp(),
      coverId: Math.floor(Math.random() * 1000),
    })
      .then((docRef) => {
        return getDoc(docRef);
      })
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = { ...docSnap.data(), id: docSnap.id } as Course;
          courseStore.addNewCourse(data);
        }
      })
      .finally(() => {
        LoadingBar.stop();
      });
  } else {
    return Promise.reject();
  }
};

const updateCourse = async (
  courseId: string,
  fields: {
    status?: number;
    name?: string;
    coverId?: number;
  },
  options?: {
    updateStore: boolean;
  }
) => {
  const userStore = useUserStore();
  if (!userStore.user) return Promise.reject();
  const docRef = doc(db, 'users', userStore.user.id, 'courses', courseId);
  const fieldsToChange = {} as {
    status?: number;
    name?: string;
    coverId?: number;
  };
  if (fields.name) {
    fieldsToChange.name = fields.name;
  }
  if (fields.status) {
    fieldsToChange.status = fields.status;
  }

  await updateDoc(docRef, fieldsToChange);

  if (options?.updateStore) {
    courseStore.updateCourse(courseId, fieldsToChange);
  }
};

const getNewCover = (courseId: string, options: { updateStore: boolean }) => {
  return updateCourse(
    courseId,
    {
      coverId: Math.floor(Math.random() * 1000),
    },
    options
  );
};

export default {
  postCourse,
  fetchCourses,
  updateCourse,
  getNewCover,
};
