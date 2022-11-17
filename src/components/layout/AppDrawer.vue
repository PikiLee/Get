<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="(v:boolean) => $emit('update:modelValue', v)"
    show-if-above
    bordered
  >
    <q-list>
      <q-item :to="{ name: 'home' }" :active="false">
        <q-item-section avatar>
          <q-icon name="home"></q-icon>
        </q-item-section>
        <q-item-section> 主页 </q-item-section>
      </q-item>

      <q-separator></q-separator>

      <q-item :to="{ name: 'setting' }" :active="false">
        <q-item-section avatar>
          <q-icon name="settings"></q-icon>
        </q-item-section>
        <q-item-section>设置</q-item-section>
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
