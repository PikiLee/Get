<template>
  <q-page>
    <div class="q-pa-md q-mx-auto q-mt-xl" style="max-width: 400px">
      <q-card>
        <q-card-section>
          <h2 class="text-h5 text-center">注册/登录</h2>
          <!-- Email Form -->
          <Transition mode="out-in" name="rotateX">
            <q-card-section v-if="!hasSentEmail">
              <BaseInput name="email" label="邮箱 *" type="email" />
              <div class="row justify-center">
                <q-btn
                  label="发送验证邮件"
                  @click="sendSignUpEmail"
                  color="primary"
                ></q-btn>
              </div>
              <div></div>
              <p class="text-center q-my-md">没有注册的邮箱将自动注册</p>
            </q-card-section>
            <!-- Resend email component -->
            <q-card-section v-else>
              <ResendEmail :email="email"></ResendEmail>
            </q-card-section>
          </Transition>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { object, string } from 'yup';
import { useForm } from 'vee-validate';
import userService from '../services/userService';
import { ref } from 'vue';
import BaseInput from 'src/components/BaseInput.vue';
import ResendEmail from 'src/components/ResendEmail.vue';

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

<style scoped lang="scss"></style>
