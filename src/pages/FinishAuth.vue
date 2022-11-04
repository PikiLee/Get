<template>
  <q-page>
    <div class="q-pa-md q-mx-auto q-mt-xl" style="max-width: 400px">
      <q-card>
        <q-card-section>
          <BaseInput
            type="email"
            label="请重新输入你的邮箱"
            name="email"
          ></BaseInput>
          <q-btn
            label="提交"
            type="submit"
            color="primary"
            @click="confirmEmail"
          />
        </q-card-section>
        <!-- <q-card-section v-else-if="formToShow === 'name'">
          <BaseInput type="text" label="用户名" name="name"></BaseInput>
          <IconSelect></IconSelect>
          <div class="row">
            <q-btn
              label="提交"
              color="primary"
              @click="setUsernameAndIcon"
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section v-else>
          <BaseInput name="password" label="密码 *" type="password" />
          <q-btn label="提交" color="primary" @click="setPassword"></q-btn>
        </q-card-section> -->
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BaseInput from 'src/components/BaseInput.vue';
import userService from 'src/services/userService';
import IconSelect from 'src/components/IconSelect.vue';
import { useForm, type ValidationResult } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { object, string } from 'yup';
import ICON1 from '../assets/usericon/icon1.jpg';

const router = useRouter();
const formToShow = ref<'email' | 'name' | 'password'>('email');

const userSchema = object({
  email: string().required('请输入邮箱').email('请输入正确的邮箱'),
  // name: string().required('请输入用户名').min(2, '用户名至少为两位'),
  // password: string().required('请输入密码').min(12, '密码至少为十二位'),
  // icon: string().required(),
});

const { validateField, values } = useForm({
  validationSchema: userSchema,
  initialValues: {
    email: '',
    // name: '',
    // password: '',
    // icon: ICON1,
  },
});

// const setUsernameAndIcon = () => {
//   Promise.all([validateField('name'), validateField('icon')]).then((res) => {
//     let isValid = true;
//     let r: ValidationResult;
//     for (r of res) {
//       if (!r.valid) {
//         isValid = false;
//       }
//     }
//     if (isValid) {
//       userService
//         .updateUsernameAndIconUrl({
//           name: values.name,
//           icon: values.icon,
//         })
//         .then(() => {
//           formToShow.value = 'password';
//         });
//     }
//   });
// };

// const setPassword = () => {
//   validateField('password').then((res) => {
//     if (res.valid) {
//       userService.updatePs(values.password).then(() => {
//         router.push({
//           name: 'home',
//         });
//       });
//     }
//   });
// };

const completeSignInViaEmailLink = (email: string) => {
  userService.completeSignInViaEmailLink(email).then(() => {
    router.push({ name: 'home' });
  });
};

const confirmEmail = () => {
  validateField('email').then((res) => {
    if (res.valid) {
      completeSignInViaEmailLink(values.email);
    }
  });
};

onMounted(() => {
  let email = window.localStorage.getItem('emailForSignIn');

  if (email) {
    completeSignInViaEmailLink(email);
  }
});
</script>

<style scoped></style>
