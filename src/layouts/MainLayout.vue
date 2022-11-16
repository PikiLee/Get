<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <RouterLink
            :to="{ path: '/' }"
            :style="{ textDecoration: 'none', color: 'white' }"
            >GET</RouterLink
          >
        </q-toolbar-title>

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
                <div class="text-h6 q-mb-md">Settings</div>
                <!-- <q-toggle v-model="mobileData" label="Use Mobile Data" />
                <q-toggle v-model="bluetooth" label="Bluetooth" /> -->
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
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-icon name="home"></q-icon>
          </q-item-section>
          <q-item-section
            ><RouterLink
              :to="{ path: '/' }"
              :style="{ textDecoration: 'none', color: 'black' }"
              >主页</RouterLink
            ></q-item-section
          >
        </q-item>

        <q-separator></q-separator>

        <q-item>
          <q-item-section avatar>
            <q-icon name="settings"></q-icon>
          </q-item-section>
          <q-item-section
            ><RouterLink
              :to="{ name: 'setting' }"
              :style="{ textDecoration: 'none', color: 'black' }"
              >设置</RouterLink
            ></q-item-section
          >
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="relative-position">
        <q-img
          src="https://source.unsplash.com/collection/1277197/500x300/?sig=99"
          height="15rem"
        />
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { date, useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';
import userService from 'src/services/userService';
import { useRouter } from 'vue-router';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

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
</script>
