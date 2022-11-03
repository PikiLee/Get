import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    name: 'home',
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'course/:courseId',
        component: () => import('pages/CourseDetail.vue'),
        name: 'course',
      },
      {
        path: 'signUp',
        component: () => import('pages/SignUp.vue'),
        name: 'signUp',
      },
      {
        path: 'logIn',
        component: () => import('pages/LogIn.vue'),
        name: 'logIn',
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
