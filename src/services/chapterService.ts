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
} from 'firebase/firestore';
import { db } from './firebase';

const chapterStore = useChapterStore();

const postChapter = async (courseId: string, newChapter: NewChapter) => {
  // Add a new document with a generated id.
  try {
    const chapterRef = await addDoc(
      collection(db, 'courses', courseId, 'chapters'),
      newChapter
    );
    const docSnap = await getDoc(chapterRef);

    chapterStore.addChapter({ ...docSnap.data(), id: docSnap.id } as Chapter);
  } catch (err) {
    throw err;
  }
};

const fetchChapters = async (courseId: string) => {
  const q = query(collection(db, 'courses', courseId, 'chapters'));

  const querySnapshot = await getDocs(q);
  const chapters: Chapter[] = [];
  querySnapshot.forEach((doc) => {
    chapters.push({ ...doc.data(), id: doc.id } as Chapter);
  });
  chapterStore.chapters = chapters;
};

const updateChapter = async (courseId: string, chapter: Chapter) => {
  const docRef = doc(db, 'courses', courseId, 'chapters', chapter.id);

  // Set the "capital" field of the city 'DC'
  return await updateDoc(docRef, {
    name: chapter.name,
    stage: chapter.stage,
    lastDate: chapter.lastDate,
  });
};

export default {
  postChapter,
  fetchChapters,
  updateChapter,
};
