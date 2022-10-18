<template>
  <q-page class="">
    <div class="relative-position">
      <q-img src="../assets/bg/book.jpg" height="15rem" />
      <div class="row no-wrap text-white justify-between absolute-bottom q-pa-sm">
        <h2 class="text-h6  q-ma-none">我的世界</h2>
        <time class="text-subtitle1">monday 1</time>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Todo, Meta } from 'components/models';
import { ref } from 'vue';

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'ct1',
  },
  {
    id: 2,
    content: 'ct2',
  },
  {
    id: 3,
    content: 'ct3',
  },
  {
    id: 4,
    content: 'ct4',
  },
  {
    id: 5,
    content: 'ct5',
  },
]);
const meta = ref<Meta>({
  totalCount: 1200,
});
</script>

<style lang="scss" scoped>
.title {
  left: 0;
  bottom: 0;
}
</style>
