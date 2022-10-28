<template>
  <q-input
    v-model="value"
    :type="!isPassword ? type : passwordType"
    :label="label"
    square
    standout
    outlined
    :error-message="errorMessage"
    :error="!!errorMessage"
  >
    <template v-slot:append>
      <q-icon
        :name="showPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="showPwd = !showPwd"
        v-if="isPassword"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { QInputProps } from 'quasar';
import { computed, ref } from 'vue';

const props = defineProps<{
  name: string;
  label: string;
  type: QInputProps['type'];
}>();

const isPassword = computed(() => {
  return props.type === 'password';
});

// use to cotrol whether show password or not
const showPwd = ref(true);

const passwordType = computed(() => {
  return showPwd.value ? 'password' : 'text';
});

const { errorMessage, value } = useField<string>(props.name);
</script>

<style scoped></style>
