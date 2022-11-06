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
              :val="info.url"
            />
          </q-item-section>
          <q-item-section>
            <q-avatar>
              <img :src="info.url" />
            </q-avatar>
            <p v-if="info.title">{{ info.title }}</p>
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
import { ref } from 'vue';

const options = ref<
  {
    url: string;
    title: string | null;
  }[]
>([
  {
    url: ICON1,
    title: '默认头像1',
  },
  {
    url: ICON2,
    title: '默认头像2',
  },
  {
    url: ICON3,
    title: '默认头像3',
  },
]);

const { value } = useField<string>('icon');

const addCustomIcon = (iconUrl: string) => {
  options.value.push({
    url: iconUrl,
    title: null,
  });
};
</script>

<style scoped></style>
