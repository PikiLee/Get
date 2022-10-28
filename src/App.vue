<template>
  <router-view />
</template>

<script setup lang="ts">
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import userService from './services/userService';
import { useUserStore } from './stores/userStore';

onAuthStateChanged(auth, (user) => {
  if (user) {
    userService.getUserProfile();
  } else {
    const userStore = useUserStore();
    userStore.user = null;
  }
});
</script>
