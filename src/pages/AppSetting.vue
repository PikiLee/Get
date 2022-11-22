<template>
  <q-page>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical>
          <q-tab name="name" icon="person" label="用户名" />
          <q-tab name="icon" icon="face" label="头像" />
          <q-tab name="password" icon="edit" label="密码" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="name">
            <div class="text-h4 q-mb-md">修改用户名</div>
            <UsernameSetting></UsernameSetting>
          </q-tab-panel>

          <q-tab-panel name="icon">
            <div class="text-h4 q-mb-md">修改头像</div>
            <IconSetting></IconSetting>
          </q-tab-panel>
          <q-tab-panel name="password">
            <div class="text-h4 q-mb-md">修改密码</div>
            <PasswordSetting></PasswordSetting>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import IconSetting from 'src/components/setting/IconSetting.vue';
import PasswordSetting from 'src/components/setting/PasswordSetting.vue';
import UsernameSetting from 'src/components/setting/UsernameSetting.vue';
import { ref } from 'vue';

const tab = ref('name');
const splitterModel = ref(20);
</script>

<style scoped></style>
