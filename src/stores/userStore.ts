import { User } from './../types/user';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isLoggedIn(state) {
      return state.user !== null;
    },
  },
  actions: {},
});
