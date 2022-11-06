<template>
  <div>
    <q-list>
      <q-item-label>选择头像</q-item-label>
      <div class="row">
        <q-item
          class="col-4"
          tag="label"
          v-ripple
          v-for="info in options"
          :key="info.url"
        >
          <q-item-section avatar>
            <q-radio
              v-model="value"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              :val="info.value"
            />
          </q-item-section>
          <q-item-section>
            <div>
              <q-avatar>
                <img :src="info.url" />
                <q-badge
                  color="secondary"
                  floating
                  v-if="info.type === 'custom'"
                  :style="{ cursor: 'pointer' }"
                >
                  <q-icon name="close" color="white"></q-icon>
                </q-badge>
              </q-avatar>
              <p v-if="info.title">{{ info.title }}</p>
            </div>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
    <MyUploader
      class="q-my-md"
      accept="image/*"
      folder="icon"
      auto-upload
      @finish-upload:file="addCustomIcon"
      max-file-size="1024000"
    ></MyUploader>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import MyUploader from './MyUploader.vue';
import ICON1 from '../assets/usericon/icon1.jpg';
import ICON2 from '../assets/usericon/icon2.jpg';
import ICON3 from '../assets/usericon/icon3.jpg';
import { onBeforeMount, ref } from 'vue';
import storageService from 'src/services/storageService';
import { useUserStore } from 'src/stores/userStore';

const options = ref<
  {
    url: string;
    title: string | null;
    type: 'default' | 'custom';
    value: string;
  }[]
>([
  {
    url: ICON1,
    title: '默认头像1',
    type: 'default',
    value: ICON1,
  },
  {
    url: ICON2,
    title: '默认头像2',
    type: 'default',
    value: ICON2,
  },
  {
    url: ICON3,
    title: '默认头像3',
    type: 'default',
    value: ICON3,
  },
]);

const { value } = useField<string>('icon');

const addCustomIcon = (opt: { url: string; fullPath: string }) => {
  options.value.push({
    url: opt.url,
    title: null,
    type: 'custom',
    value: opt.fullPath,
  });
};

// fetch current user's icons
const userStore = useUserStore();
onBeforeMount(() => {
  storageService
    .fetchFile({
      folder: 'icon',
      userId: userStore.user?.id ?? 'default',
    })
    .then((res) => {
      res.forEach((icon) => {
        options.value.push({
          url: icon.url,
          value: icon.fullPath,
          title: null,
          type: 'custom',
        });
      });
    });
});
</script>

<style scoped></style>
