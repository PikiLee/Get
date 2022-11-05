<template>
  <div>
    <BaseInput name="password" label="密码 *" type="password" />
    <q-btn
      class="q-my-md"
      :loading="loading"
      label="提交"
      color="primary"
      @click="setPassword"
    ></q-btn>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import BaseInput from 'src/components/BaseInput.vue';
import userService from 'src/services/userService';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { object, string } from 'yup';

const $q = useQuasar();
const loading = ref(false);

const userSchema = object({
  password: string().required('请输入密码').min(12, '密码至少为十二位'),
});

const { validateField, values } = useForm({
  validationSchema: userSchema,
  initialValues: {
    password: '',
  },
});

const setPassword = () => {
  validateField('password').then((res) => {
    if (res.valid) {
      loading.value = true;
      userService
        .updatePs(values.password)
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
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
</script>

<style scoped></style>
