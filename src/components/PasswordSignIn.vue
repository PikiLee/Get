<template>
  <div>
    <h2 class="text-h5 text-center">密码登录</h2>
    <h3 class="text-subtitle1 text-center text-grey-7">
      使用邮件验证登录并设置密码后，才可使用密码登录
    </h3>
    <BaseInput
      label="邮箱 *"
      name="email"
      type="text"
      class="q-my-sm"
    ></BaseInput>
    <BaseInput label="密码 *" name="password" type="password"></BaseInput>
    <div class="row justify-center">
      <q-btn label="登录" color="primary"></q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from './BaseInput.vue';
import { object, string } from 'yup';
import userService from 'src/services/userService';
import { useForm } from 'vee-validate';

// email form
const userSchema = object({
  //   email: string().required('请输入邮箱').email('请输入正确的邮箱'),
  email: string().test(async (value, context) => {
    if (!value) {
      return context.createError({
        message: '请输入邮箱',
      });
    } else if (!(await string().email().isValid(value))) {
      return context.createError({
        message: '请输入正确的邮箱',
      });
    } else if (!(await userService.canUserSignInWithEmailPassword(value))) {
      return context.createError({
        message: '邮箱未设置密码',
      });
    } else {
      return true;
    }
  }),
  password: string().min(12, '密码至少为12位'),
});

const { handleSubmit, values } = useForm<{ email: string }>({
  validationSchema: userSchema,
  initialValues: {
    email: '',
  },
});
</script>

<style scoped></style>
