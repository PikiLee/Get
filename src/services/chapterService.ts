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
import { LoadingBar } from 'quasar';

const chapterStore = useChapterStore();
const orderInterval = 100;

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
  if (!userStore.user) {
    throw Error;
  }

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
    LoadingBar.start();
    const chapterStore = useChapterStore();
    let order = orderInterval;
    if (chapterStore.chapters.length !== 0) {
      order =
        chapterStore.chapters[chapterStore.chapters.length - 1].order +
        orderInterval;
    }
    const chapterRef = await addDoc(getChapterCollection(courseId), {
      ...newChapter,
      order,
      createdAt: serverTimestamp(),
    });
    const docSnap = await getDoc(chapterRef);

    chapterStore.addChapter({
      ...docSnap.data(),
      id: docSnap.id,
      createdAt: docSnap.data()?.createdAt.toDate(),
    } as Chapter);
    LoadingBar.stop();
  } catch (err) {
    throw err;
  }
};

const fetchChapters = async (courseId: string) => {
  try {
    LoadingBar.start();
    if (chapterStore.chapters.length !== 0) return;
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
    LoadingBar.stop();
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
    order?: number;
  },
  options?: {
    updateStore?: boolean;
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

    const res = await updateDoc(docRef, fieldsToChange);

    if (options?.updateStore) {
      chapterStore.updateChapter(chapterId, fieldsToChange);
    }
    return res;
  } catch (err) {
    throw err;
  }
};

const deleteChapter = async (courseId: string, chapterId: string) => {
  try {
    LoadingBar.start();
    await deleteDoc(getChapterDoc(courseId, chapterId));
    chapterStore.deleteChapter(chapterId);
    LoadingBar.stop();
  } catch (err) {
    throw err;
  }
};

const exchangeOrder = async (
  courseId: string,
  oldIndex: number,
  newIndex: number
) => {
  if (oldIndex === newIndex) return;

  try {
    const chapterStore = useChapterStore();
    const oldChapter = chapterStore.chapters[oldIndex];
    const newChapter = chapterStore.chapters[newIndex];

    chapterStore.exchangeChapter(oldIndex, newIndex);

    await updateChapter(courseId, oldChapter.id, {
      order: oldChapter.order,
    });
    await updateChapter(courseId, newChapter.id, {
      order: newChapter.order,
    });
  } catch (err) {
    throw err;
  }
};

export default {
  postChapter,
  fetchChapters,
  updateChapter,
  deleteChapter,
  exchangeOrder,
};