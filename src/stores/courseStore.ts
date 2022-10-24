import { Course } from './../types/course';
import { defineStore } from 'pinia';

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [] as Course[],
  }),
  getters: {},
  actions: {
    addNewCourse(course: Course) {
      this.courses.push(course);
    },
  },
});
