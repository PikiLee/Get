<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="(v:boolean) => $emit('update:modelValue', v)"
    show-if-above
    bordered
  >
    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-icon name="home"></q-icon>
        </q-item-section>
        <q-item-section
          ><RouterLink
            :to="{ path: '/' }"
            :style="{ textDecoration: 'none', color: 'black' }"
            >主页</RouterLink
          ></q-item-section
        >
      </q-item>

      <q-separator></q-separator>

      <q-item>
        <q-item-section avatar>
          <q-icon name="settings"></q-icon>
        </q-item-section>
        <q-item-section
          ><RouterLink
            :to="{ name: 'setting' }"
            :style="{ textDecoration: 'none', color: 'black' }"
            >设置</RouterLink
          ></q-item-section
        >
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();

defineEmits(['update:modelValue']);
</script>

<style scoped></style>
