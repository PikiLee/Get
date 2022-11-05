<template>
  <div class="text-h4 q-mb-md">修改用户名</div>
  <p>
    现用户名：<span>{{ userStore.user?.name }}</span>
  </p>
  <BaseInput type="text" label="用户名" name="name"></BaseInput>
  <div class="row q-my-md">
    <q-btn label="提交" color="primary" @click="setUsernameAndIcon"></q-btn>
  </div>
</template>

<script setup lang="ts">
import { object, string } from 'yup';
import { useForm } from 'vee-validate';
import userService from 'src/services/userService';
import BaseInput from './BaseInput.vue';
import { useUserStore } from 'src/stores/userStore';
import { useQuasar } from 'quasar';

const userStore = useUserStore();
const $q = useQuasar();

const userSchema = object({
  name: string().required('请输入用户名').min(2, '用户名至少为两位'),
});

const { validateField, values } = useForm({
  validationSchema: userSchema,
  initialValues: {
    name: '',
  },
});

const setUsernameAndIcon = () => {
  validateField('name').then((res) => {
    if (res.valid) {
      userService
        .updateUsernameAndIconUrl({
          name: values.name,
          icon: null,
        })
        .then(() => {
          $q.notify({
            message: '修改成功',
            color: 'positive',
          });
        })
        .catch(() => {
          $q.notify({
            message: '修改失败',
            color: 'negative',
          });
        });
    }
  });
};
</script>

<style scoped></style>
