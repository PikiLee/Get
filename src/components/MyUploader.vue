<template>
  <q-card class="card">
    <q-card-section class="bg-primary text-white row items-center">
      <div class="col-7">
        <q-linear-progress
          stripe
          rounded
          size="10px"
          :value="progress"
          color="secondary"
          animation-speed="100"
        />
      </div>
      <q-space></q-space>
      <q-btn
        icon="add"
        color="white"
        class="text-black col-2"
        @click="fileInputer?.pickFiles"
      >
        <q-file
          v-model="file"
          label="Standard"
          class="file-inputer"
          ref="fileInputer"
          :accept="accept"
          :max-file-size="maxFileSize"
          @rejected="isOverSized = true"
        />
      </q-btn>
      <q-space></q-space>
      <q-btn
        v-if="hasAddedFile"
        icon="upload"
        color="white"
        class="text-black col-2"
        @click="uploadFile"
      ></q-btn>
    </q-card-section>
    <q-card-section>
      <figure v-if="file" class="q-ma-none">
        <figcaption class="text-center q-mb-sm">
          <header>
            {{ file?.name }}
          </header>
          <p>
            <q-icon
              name="error"
              size="1rem"
              color="negative"
              v-if="isError"
            ></q-icon>
            <q-icon
              name="done"
              size="1rem"
              color="positive"
              v-if="isDone"
            ></q-icon>
            <span>
              {{ file?.size * 0.001 + ' KB' }}
            </span>
          </p>
        </figcaption>
        <div class="relative-position">
          <q-img :src="fileURL" />
          <q-badge
            color="black"
            class="cross q-pa-xs"
            floating
            @click="clearFile"
          >
            <q-icon name="close" size="1rem" />
          </q-badge>
        </div>
      </figure>
    </q-card-section>
    <q-card-section v-if="isOverSized">
      <p class="text-center text-negative">
        文件大小不能超过{{ Number(maxFileSize) * 0.001 + 'KB' }}
      </p>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { QFile } from 'quasar';
import storageService from 'src/services/storageService';
import { useUserStore } from 'src/stores/userStore';

const props = defineProps<{
  accept?: string;
  folder: keyof typeof storageService.storageFolder;
  autoUpload?: boolean;
  maxFileSize?: number | string;
}>();

const emits = defineEmits(['finishUpload:file']);

const file = ref<File | null>(null);
const fileURL = computed(() => {
  if (file.value) {
    return URL.createObjectURL(file.value);
  } else {
    return '';
  }
});
const hasAddedFile = computed(() => {
  return !!file.value;
});
const fileInputer = ref<typeof QFile | null>(null);

const clearFile = () => {
  file.value = null;
  progress.value = 0;
};

const userStore = useUserStore();

const { start, progress, isError, isDone, url } = storageService.upload({
  folder: props.folder,
  userId: userStore.user?.id ?? 'default',
});

const uploadFile = () => {
  if (file.value) {
    isOverSized.value = false;
    start(file.value);
  }
};

// auto upload
if (props.autoUpload) {
  watch(file, (newValue) => {
    if (newValue) {
      uploadFile();
    }
  });
}

// emit file url
watch(url, (newValue) => {
  if (newValue) {
    emits('finishUpload:file', newValue);
  }
});

// check if the file is too large
const isOverSized = ref(false);
</script>

<style scoped lang="scss">
.card {
  width: 20rem;
  max-width: 90%;

  .file-inputer {
    opacity: 0;
    user-select: none;
    pointer-events: none;
    position: absolute;
    left: -9999px;
    top: -9999px;
  }

  .cross {
    cursor: pointer;
  }
}
</style>
