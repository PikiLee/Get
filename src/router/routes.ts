import { useCourseStore } from 'src/stores/courseStore';
import { RouteRecordRaw } from 'vue-router';
import chapterService from 'src/services/chapterService';
import courseService from 'src/services/courseService';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/IndexPage.vue'),
        name: 'home',
        meta: { requiresAuth: true },
        beforeEnter: () => {
          const courseStore = useCourseStore();
          if (courseStore.courses.length === 0) {
            courseService.fetchCourses();
          }
        },
      },
      {
        path: 'course/:courseId',
        component: () => import('pages/CourseDetail.vue'),
        name: 'course',
        meta: { requiresAuth: true },
        beforeEnter: (to) => {
          const courseId =
            typeof to.params.courseId === 'string'
              ? to.params.courseId
              : to.params.courseId[0];

          return new Promise((resolve) => {
            chapterService.fetchChapters(courseId).then(() => {
              resolve();
            });
          });
        },
      },
      {
        path: 'setting',
        component: () => import('pages/AppSetting.vue'),
        name: 'setting',
        meta: { requiresAuth: true },
      },
      {
        path: 'auth',
        children: [
          {
            path: 'signUp/finishAuth',
            component: () => import('pages/FinishAuth.vue'),
            name: 'finishAuth',
          },
          {
            path: 'signUp',
            component: () => import('pages/SignUp.vue'),
            name: 'signUp',
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
