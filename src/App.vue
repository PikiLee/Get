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

<style lang="scss">
.rotateX-enter-active,
.rotateX-leave-active {
  transition: all 200ms linear;
  transform-origin: center center -50px;
  perspective: 800px;
}

.rotateX-leave-to {
  transform: rotateX(90deg);
  opacity: 0;
}

.rotateX-enter-from {
  transform: rotateX(-90deg);
  opacity: 0;
}
</style>
