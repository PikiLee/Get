<template>
  <div>
    <BaseInput name="password" label="密码 *" type="password" />
    <q-btn
      class="q-my-md"
      label="提交"
      color="primary"
      @click="setPassword"
    ></q-btn>
  </div>
</template>

<script setup lang="ts">
import BaseInput from 'src/components/BaseInput.vue';
import userService from 'src/services/userService';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';

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
      userService.updatePs(values.password);
    }
  });
};
</script>

<style scoped></style>
