<template>
  <q-card class="card">
    <q-card-section class="bg-primary text-white row items-center">
      <div class="col-9">
        <q-linear-progress
          stripe
          rounded
          size="10px"
          :value="progress"
          color="secondary"
          class="col-9"
        />
      </div>
      <q-space></q-space>
      <q-btn
        icon="add"
        color="white"
        class="text-black col-2"
        @click="fileInputer?.pickFiles"
        v-if="!hasAddedFile"
      >
        <q-file
          v-model="file"
          label="Standard"
          class="file-inputer"
          ref="fileInputer"
          :accept="accept"
        />
      </q-btn>
      <q-btn
        v-else
        icon="upload"
        color="white"
        class="text-black col-2"
        @click="uploadFile"
      ></q-btn>
    </q-card-section>
    <q-card-section>
      <figure v-if="fileURL" class="q-ma-none">
        <figcaption class="text-center q-mb-sm">
          <header>
            {{ file?.name }}
          </header>
          <p>{{ file?.size + ' KB' }}</p>
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
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { QFile } from 'quasar';

defineProps<{
  accept?: string;
}>();
const emits = defineEmits(['upload:file']);

const progress = ref(0.3);
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
};

const uploadFile = () => {
  emits('upload:file', file.value);
};
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
