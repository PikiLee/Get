import { useUserStore } from './../stores/userStore';
import { useChapterStore } from './../stores/chapterStore';
import { NewChapter, Chapter } from './../types/chapter';
import {
  collection,
  addDoc,
  query,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const chapterStore = useChapterStore();

const getChapterCollection = (courseId: string) => {
  const userStore = useUserStore();
  if (!userStore.user) throw Error;
  return collection(
    db,
    'users',
    userStore.user.id,
    'courses',
    courseId,
    'chapters'
  );
};

const getChapterDoc = (courseId: string, chapterId: string) => {
  const userStore = useUserStore();
  if (!userStore.user) throw Error;
  return doc(
    db,
    'users',
    userStore.user.id,
    'courses',
    courseId,
    'chapters',
    chapterId
  );
};

const postChapter = async (courseId: string, newChapter: NewChapter) => {
  // Add a new document with a generated id.
  try {
    const chapterRef = await addDoc(getChapterCollection(courseId), {
      ...newChapter,
      createdAt: serverTimestamp(),
    });
    const docSnap = await getDoc(chapterRef);

    chapterStore.addChapter({
      ...docSnap.data(),
      id: docSnap.id,
      createdAt: docSnap.data()?.createdAt.toDate(),
    } as Chapter);
  } catch (err) {
    throw err;
  }
};

const fetchChapters = async (courseId: string) => {
  try {
    const q = query(getChapterCollection(courseId));

    const querySnapshot = await getDocs(q);
    const chapters: Chapter[] = [];
    querySnapshot.forEach((doc) => {
      chapters.push({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data()?.createdAt.toDate(),
      } as Chapter);
    });
    chapterStore.setChapters(chapters);
  } catch (err) {
    throw err;
  }
};

const updateChapter = async (
  courseId: string,
  chapterId: string,
  fields: {
    name?: string;
    stage?: string;
    lastDate?: number;
  }
) => {
  try {
    const docRef = getChapterDoc(courseId, chapterId);

    const fieldsToChange = { ...fields };
    let key: keyof typeof fieldsToChange;
    for (key in fieldsToChange) {
      if (!fieldsToChange[key]) {
        delete fieldsToChange[key];
      }
    }

    return await updateDoc(docRef, fieldsToChange);
  } catch (err) {
    throw err;
  }
};

const deleteChapter = async (courseId: string, chapterId: string) => {
  try {
    await deleteDoc(getChapterDoc(courseId, chapterId));
    chapterStore.deleteChapter(chapterId);
  } catch (err) {
    throw err;
  }
};

export default {
  postChapter,
  fetchChapters,
  updateChapter,
  deleteChapter,
};
