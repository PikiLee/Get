<template>
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

      <q-item>
        <q-item-section avatar>
          <q-item-label class="q-my-md">上传头像</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-uploader
            url="http://localhost:4444/upload"
            style="max-width: 300px"
          />
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

interface ImgInfo {
  url: string;
  title: string | null;
}

defineProps<{
  imgInfos: ImgInfo[];
}>();

const { value } = useField<string>('icon');
</script>

<style scoped></style>
