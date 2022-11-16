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
import { db, auth } from './firebase';
import { LoadingBar } from 'quasar';

const orderInterval = 100;

const getChapterCollection = (courseId: string) => {
  try {
    if (!auth.currentUser) throw 'User not login';
    return collection(
      db,
      'users',
      auth.currentUser.uid,
      'courses',
      courseId,
      'chapters'
    );
  } catch (err) {
    console.log('getChapterCollection:' + err);
    throw err;
  }
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

const postChapter = async (
  courseId: string,
  newChapter: NewChapter,
  options?: {
    showLoading: boolean;
  }
) => {
  try {
    if (options?.showLoading) {
      LoadingBar.start();
    }

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

    if (options?.showLoading) {
      LoadingBar.stop();
    }
  } catch (err) {
    throw err;
  }
};

const fetchChapters = async (
  courseId: string,
  options?: {
    showLoading: boolean;
  }
) => {
  try {
    if (options?.showLoading) {
      LoadingBar.start();
    }

    const chapterStore = useChapterStore();
    if (chapterStore.currentCourseId === courseId) return;
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
    chapterStore.currentCourseId = courseId;

    if (options?.showLoading) {
      LoadingBar.stop();
    }
  } catch (err) {
    console.log(err);
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
    showLoading?: boolean;
  }
) => {
  try {
    if (options?.showLoading) {
      LoadingBar.start();
    }

    const chapterStore = useChapterStore();

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

    if (options?.showLoading) {
      LoadingBar.stop();
    }

    return res;
  } catch (err) {
    throw err;
  }
};

const deleteChapter = async (
  courseId: string,
  chapterId: string,
  options?: {
    showLoading?: boolean;
  }
) => {
  try {
    if (options?.showLoading) {
      LoadingBar.start();
    }

    const chapterStore = useChapterStore();
    await deleteDoc(getChapterDoc(courseId, chapterId));
    chapterStore.deleteChapter(chapterId);

    if (options?.showLoading) {
      LoadingBar.stop();
    }
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
