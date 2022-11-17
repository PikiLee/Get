<template>
  <div>
    <RouterLink
      :to="{ name: 'signUp' }"
      :style="{ textDecoration: 'none', color: 'white' }"
      class="q-mr-md"
      v-if="!userStore.isLoggedIn"
      >注册/登录</RouterLink
    >

    <q-avatar v-if="userStore.user" :style="{ cursor: 'pointer' }">
      <img :src="userStore.user?.icon.url" />
      <q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md row justify-between items-center">
              <span class="col-6">设置</span>
              <q-btn
                icon="chevron_right"
                flat
                class="col-6"
                :to="{ name: 'setting' }"
              ></q-btn>
            </div>
            <q-toggle v-model="isDark" label="暗黑模式" />
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px" v-if="userStore.user?.icon">
              <img :src="userStore.user?.icon.url" />
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">
              {{ userStore.user.name }}
            </div>

            <q-btn
              color="primary"
              label="退出"
              push
              size="sm"
              v-close-popup
              @click="logOut"
            />
          </div>
        </div>
      </q-menu>
    </q-avatar>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from '../../stores/userStore';
import userService from '../../services/userService';
import { useRouter } from 'vue-router';
import { useDark } from '@vueuse/core';

const userStore = useUserStore();
const $q = useQuasar();
const router = useRouter();
const logOut = () => {
  userService
    .logOut()
    .then(() => {
      $q.notify({
        message: '退出成功',
        color: 'positive',
      });
      router.push({
        name: 'signUp',
      });
    })
    .catch(() => {
      $q.notify({
        message: '退出失败',
        color: 'negative',
      });
    });
};

// Dark Mode
const isDark = useDark();

watch(
  isDark,
  (newValue) => {
    $q.dark.set(newValue);
  },
  {
    immediate: true,
  }
);
</script>

<style scoped></style>
