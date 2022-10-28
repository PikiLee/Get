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

        <q-avatar v-if="userStore.user?.icon">
          <img :src="userStore.user?.icon" />
        </q-avatar>
        <q-btn flat round dense icon="person" v-if="userStore.user">
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
                <q-toggle v-model="mobileData" label="Use Mobile Data" />
                <q-toggle v-model="bluetooth" label="Bluetooth" />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px" v-if="userStore.user?.icon">
                  <img :src="userStore.user?.icon" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

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
            <q-avatar>
              <img :src="userStore.user?.icon" />
            </q-avatar>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item>
          <q-item-section
            ><RouterLink
              :to="{ path: '/' }"
              :style="{ textDecoration: 'none', color: 'black' }"
              >Home</RouterLink
            ></q-item-section
          >
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="relative-position">
        <q-img src="../assets/bg/book.jpg" height="15rem" />
        <div
          class="row no-wrap text-white justify-between absolute-bottom q-pa-sm"
        >
          <time class="text-subtitle1">{{
            date.formatDate(Date.now(), 'YYYY-MM-DD')
          }}</time>
        </div>
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

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const userStore = useUserStore();
const $q = useQuasar();

const logOut = () => {
  userService
    .logOut()
    .then(() => {
      $q.notify({
        message: '退出成功',
        color: 'positive',
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
