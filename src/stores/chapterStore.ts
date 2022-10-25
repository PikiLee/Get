import { Chapter } from './../types/chapter';
import { defineStore } from 'pinia';

export const useChapterStore = defineStore('chapter', {
  state: () => ({
    chapters: [] as Chapter[],
  }),
  getters: {},
  actions: {
    addChapter(chapter: Chapter) {
      this.chapters.push(chapter);
    },
  },
});
