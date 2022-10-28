<template>
  <q-page>
    <div class="q-pa-md q-mx-auto q-mt-xl" style="max-width: 400px">
      <q-form @submit="onSubmit" @reset="handleReset" class="q-gutter-md">
        <BaseInput name="email" label="邮箱 *" type="email" />
        <BaseInput name="password" label="密码 *" type="password" />

        <div>
          <q-btn
            label="登录"
            type="submit"
            color="primary"
            :disable="!isValid"
          />
          <q-btn
            label="重置"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { object, string } from 'yup';
import { useForm } from 'vee-validate';
import userService from '../services/userService';
import { useQuasar } from 'quasar';
import { SignInInfo } from '../types/user';
import { computed } from 'vue';
import BaseInput from 'src/components/BaseInput.vue';

const $q = useQuasar();

const userSchema = object({
  email: string().email('请输入正确的邮箱').required('请输入邮箱'),
  password: string().required('请输入密码').min(12, '密码至少为十二位'),
});

const { handleSubmit, handleReset, meta } = useForm<SignInInfo>({
  validationSchema: userSchema,
  initialValues: {
    email: '',
    password: '',
  },
});

// submit values if they are valid
const onSubmit = handleSubmit((signInInfo) => {
  userService
    .signIn(signInInfo)
    .then(() => {
      $q.notify({
        message: '登录成功',
        color: 'positive',
      });
    })
    .catch(() => {
      $q.notify({
        message: '登录失败',
        color: 'negative ',
      });
    });
});

// form's validity status
const isValid = computed(() => meta.value.valid && meta.value.dirty);
</script>

<style scoped></style>
