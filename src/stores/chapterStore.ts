import { Chapter } from './../types/chapter';
import { defineStore } from 'pinia';
import { deleteUndefinedPropertiesOfObject } from 'src/utils/objectUtils';

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
    exchangeChapter(oldIndex: number, newIndex: number) {
      if (oldIndex === newIndex) return;

      const oldChapter = this.chapters[oldIndex];
      const newChapter = this.chapters[newIndex];

      let order;

      if (oldIndex > newIndex) {
        if (newIndex === 0) {
          order = newChapter.order / 2;
        } else {
          order = (newChapter.order + this.chapters[newIndex - 1].order) / 2;
        }

        oldChapter.order = order;

        this.chapters.splice(oldIndex, 1);
        this.chapters.splice(newIndex, 0, oldChapter);
      } else {
        if (newIndex === this.chapters.length - 1) {
          order = newChapter.order + 100;
        } else {
          order = (newChapter.order + this.chapters[newIndex + 1].order) / 2;
        }

        oldChapter.order = order;

        this.chapters.splice(newIndex + 1, 0, oldChapter);
        this.chapters.splice(oldIndex, 1);
      }
    },
    updateChapter(
      chapterId: string,
      fields: {
        name?: string;
        stage?: string;
        lastDate?: number;
        order?: number;
      }
    ) {
      const fieldsToChange = deleteUndefinedPropertiesOfObject(fields);
      this.chapters.forEach((chapter) => {
        if (chapter.id === chapterId) {
          Object.assign(chapter, fieldsToChange);
        }
      });
    },
  },
});
