<template>
  <div>
    <div v-if="!hasSentEmail">
      <h2 class="text-h5 text-center">邮件验证登录</h2>
      <h3 class="text-subtitle1 text-grey-8 text-center q-my-md">
        未注册邮箱将自动注册
      </h3>
      <BaseInput name="email" label="邮箱 *" type="email" />
      <div class="row justify-center">
        <q-btn
          label="发送邮件"
          @click="sendSignUpEmail"
          color="primary"
        ></q-btn>
      </div>
      <div></div>
    </div>
    <ResendEmail v-else :email="email"></ResendEmail>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '../BaseInput.vue';
import ResendEmail from './ResendEmail.vue';
import { object, string } from 'yup';
import { useForm } from 'vee-validate';
import userService from '../../services/userService';
import { ref } from 'vue';

// email form
const userSchema = object({
  email: string().required('请输入邮箱').email('请输入正确的邮箱'),
  // email: string().test(async (value, context) => {
  //   if (!value) {
  //     return context.createError({
  //       message: '请输入邮箱',
  //     });
  //   } else if (!(await string().email().isValid(value))) {
  //     return context.createError({
  //       message: '请输入正确的邮箱',
  //     });
  //   } else if (await userService.checkIfEmailExists(value)) {
  //     return context.createError({
  //       message: '邮箱已注册',
  //     });
  //   } else {
  //     return true;
  //   }
  // }),
});

const { validateField, values } = useForm<{ email: string }>({
  validationSchema: userSchema,
  initialValues: {
    email: '',
  },
});

// resend email
const email = ref('');
const hasSentEmail = ref(false);
const sendSignUpEmail = () => {
  validateField('email').then((res) => {
    if (res.valid) {
      userService.signInOrLogInViaEmailLink(values.email).then(() => {
        hasSentEmail.value = true;
        email.value = values.email;
      });
    }
  });
};
</script>

<style scoped></style>
