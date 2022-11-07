<template>
  <q-page>
    <div class="q-pa-md q-mx-auto q-mt-xl" style="max-width: 400px">
      <q-card>
        <q-card-section>
          <!-- Email Form -->
          <Transition mode="out-in" name="rotateX">
            <EmailLink v-if="!isPasswordMethod"></EmailLink>
            <!-- <q-card-section v-if="!hasSentEmail"> </q-card-section> -->
            <!-- Resend email component -->
            <!-- <q-card-section v-else> </q-card-section> -->
            <PasswordSignIn v-else></PasswordSignIn>
          </Transition>
        </q-card-section>
        <q-card-actions class="row justify-center">
          <q-btn
            label="密码登录"
            flat
            color="primary"
            @click="usePasswordMethod"
            v-if="!isPasswordMethod"
          ></q-btn>
          <q-btn
            label="邮件验证登录"
            flat
            color="primary"
            @click="useEmailLinkMethod"
            v-else
          ></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// import { object, string } from 'yup';
// import { useForm } from 'vee-validate';
// import userService from '../services/userService';
import { ref } from 'vue';

import EmailLink from 'src/components/auth/EmailLink.vue';
import PasswordSignIn from 'src/components/auth/PasswordSignIn.vue';

const isPasswordMethod = ref(false);

const usePasswordMethod = () => {
  isPasswordMethod.value = true;
};
const useEmailLinkMethod = () => {
  isPasswordMethod.value = false;
};

// // email form
// const userSchema = object({
//   email: string().required('请输入邮箱').email('请输入正确的邮箱'),
//   // email: string().test(async (value, context) => {
//   //   if (!value) {
//   //     return context.createError({
//   //       message: '请输入邮箱',
//   //     });
//   //   } else if (!(await string().email().isValid(value))) {
//   //     return context.createError({
//   //       message: '请输入正确的邮箱',
//   //     });
//   //   } else if (await userService.checkIfEmailExists(value)) {
//   //     return context.createError({
//   //       message: '邮箱已注册',
//   //     });
//   //   } else {
//   //     return true;
//   //   }
//   // }),
// });

// const { validateField, values } = useForm<{ email: string }>({
//   validationSchema: userSchema,
//   initialValues: {
//     email: '',
//   },
// });

// // resend email
// const email = ref('');
// const hasSentEmail = ref(false);
// const sendSignUpEmail = () => {
//   validateField('email').then((res) => {
//     if (res.valid) {
//       userService.signInOrLogInViaEmailLink(values.email).then(() => {
//         hasSentEmail.value = true;
//         email.value = values.email;
//       });
//     }
//   });
// };
</script>

<style scoped lang="scss"></style>
