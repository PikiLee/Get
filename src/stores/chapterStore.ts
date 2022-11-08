import { Chapter } from './../types/chapter';
import { defineStore } from 'pinia';

export const useChapterStore = defineStore('chapter', {
  state: () => ({
    chapters: [] as Chapter[],
  }),
  getters: {},
  actions: {
    setChapters(chapters: Chapter[]) {
      this.chapters = chapters.sort((a, b) => {
        if (a.stage === b.stage) {
          if (a.createdAt === b.createdAt) {
            return 0;
          } else if (a.createdAt > b.createdAt) {
            return 1;
          } else {
            return -1;
          }
        } else {
          return a.stage > b.stage ? -1 : 1;
        }
      });
    },
    addChapter(chapter: Chapter) {
      this.chapters.push(chapter);
    },
    deleteChapter(chapterId: string) {
      this.chapters = this.chapters.filter(
        (chapter) => chapter.id !== chapterId
      );
    },
  },
});
