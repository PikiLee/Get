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
        if (a.order > b.order) {
          return 1;
        } else if (a.order < b.order) {
          return -1;
        } else {
          return 0;
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
