<template>
  <div>
    <!-- <BaseInput name="password" label="密码 *" type="password" />
    <q-btn
      class="q-my-md"
      :loading="loading"
      label="提交"
      color="primary"
      @click="setPassword"
    ></q-btn> -->
    <p v-if="hasSentEmail && count > 0">{{ count }}后可以重发邮件</p>
    <q-btn
      :label="hasSentEmail ? '重新发送重置密码邮件' : '发送重置密码邮件'"
      :loading="loading"
      color="primary"
      @click="sendEmail"
      :disable="hasSentEmail && count > 0"
    ></q-btn>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
// import BaseInput from 'src/components/BaseInput.vue';
import userService from 'src/services/userService';
import { useUserStore } from 'src/stores/userStore';
// import { useForm } from 'vee-validate';
import { ref } from 'vue';
// import { object, string } from 'yup';
import { useCountdown } from '../../utils/useCountdown';

const $q = useQuasar();
const loading = ref(false);

// const userSchema = object({
//   password: string().required('请输入密码').min(12, '密码至少为十二位'),
// });

// const { validateField, values } = useForm({
//   validationSchema: userSchema,
//   initialValues: {
//     password: '',
//   },
// });

// const setPassword = () => {
//   validateField('password').then((res) => {
//     if (res.valid) {
//       loading.value = true;
//       userService
//         .updatePs(values.password)
//         .then(() => {
//           $q.notify({
//             message: '修改成功',
//             color: 'positive',
//           });
//         })
//         .catch(() => {
//           $q.notify({
//             message: '修改失败',
//             color: 'negative',
//           });
//         })
//         .finally(() => {
//           loading.value = false;
//         });
//     }
//   });
// };

const userStore = useUserStore();
const sendEmail = () => {
  if (userStore.user) {
    loading.value = true;
    userService
      .sendResetPasswordEmail(userStore.user.email)
      .then(() => {
        $q.notify({
          message: '发送成功',
          color: 'positive',
        });
        hasSentEmail.value = true;
        reset();
        resume();
      })
      .catch(() => {
        $q.notify({
          message: '发送失败',
          color: 'negative',
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

// countdown to resend email
const hasSentEmail = ref(false);
const { count, resume, reset } = useCountdown(60);
</script>

<style scoped></style>
