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
                  v-if="
                    info.type === 'custom' &&
                    info.value !== userStore.user?.icon.fullPath
                  "
                  :style="{ cursor: 'pointer' }"
                  @click.stop.prevent="deleteIcon(info.value)"
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
    <p>上传头像</p>
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
>([]);

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
      userId: 'default',
    })
    .then((res) => {
      res.forEach((icon) => {
        options.value.push({
          url: icon.url,
          value: icon.fullPath,
          title: '默认头像',
          type: 'default',
        });
      });
    });

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

const deleteIcon = (fullPath: string) => {
  storageService.deleteFile(fullPath).then(() => {
    const index = options.value.findIndex((opt) => opt.value === fullPath);
    options.value.splice(index, 1);
  });
};
</script>

<style scoped></style>
