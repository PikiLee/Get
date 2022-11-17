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

        <UserCard></UserCard>
      </q-toolbar>
    </q-header>

    <AppDrawer v-model="leftDrawerOpen"></AppDrawer>

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
import UserCard from 'src/components/layout/UserCard.vue';
import AppDrawer from 'src/components/layout/AppDrawer.vue';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
