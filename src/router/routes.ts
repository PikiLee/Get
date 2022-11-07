import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/UserHome.vue'),
        name: 'home',
        meta: { requiresAuth: true },
      },
      {
        path: 'course/:courseId',
        component: () => import('pages/CourseDetail.vue'),
        name: 'course',
        meta: { requiresAuth: true },
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
            path: 'signUp',
            component: () => import('pages/SignUp.vue'),
            name: 'signUp',
          },
          {
            path: 'finishAuth',
            component: () => import('pages/FinishAuth.vue'),
            name: 'finishAuth',
          },
          {
            path: 'logIn',
            component: () => import('pages/LogIn.vue'),
            name: 'logIn',
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
