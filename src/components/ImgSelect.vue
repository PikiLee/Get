<template>
  <div>
    <q-list>
      <q-item-label>选择头像</q-item-label>
      <div class="row">
        <q-item
          class="col-4"
          tag="label"
          v-ripple
          v-for="info in imgInfos"
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
    <MyUploader class="q-my-md" accept="image/*"></MyUploader>
  </div>
</template>

<script setup lang="ts">
import storageService from 'src/services/storageService';
import { useField } from 'vee-validate';
import { ref, watch } from 'vue';
import MyUploader from './MyUploader.vue';

interface ImgInfo {
  url: string;
  title: string | null;
}

defineProps<{
  imgInfos: ImgInfo[];
}>();

const { value } = useField<string>('icon');
const icon = ref<File | null>(null);

watch<File | null>(icon, (newValue: File | null) => {
  if (newValue) {
    storageService.uploadIcon(newValue);
  }
});
</script>

<style scoped></style>
