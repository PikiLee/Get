<template>
  <router-view />
</template>

<script setup lang="ts"></script>

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
