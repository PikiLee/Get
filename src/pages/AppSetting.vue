<template>
  <q-page>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-tab name="name" icon="person" label="用户名" />
          <q-tab name="icon" icon="face" label="头像" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="name">
            <UsernameSetting></UsernameSetting>
          </q-tab-panel>

          <q-tab-panel name="icon"> </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import UsernameSetting from 'src/components/UsernameSetting.vue';
import { ref } from 'vue';

const tab = ref('name');
const splitterModel = ref(20);
</script>

<style scoped></style>
