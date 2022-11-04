<template>
  <q-page>
    <div class="q-pa-md q-mx-auto q-mt-xl" style="max-width: 400px">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <BaseInput
          type="email"
          label="请重新输入你的邮箱"
          name="email"
        ></BaseInput>
        <q-btn label="提交" type="submit" color="primary" @click="onSubmit" />
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BaseInput from 'src/components/BaseInput.vue';
import userService from 'src/services/userService';
import { useForm } from 'vee-validate';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { object, string } from 'yup';

const emailSchema = object({
  email: string().required('请输入邮箱').email('请输入正确的邮箱'),
});

const { handleSubmit } = useForm({
  validationSchema: emailSchema,
});

const onSubmit = handleSubmit((values) => {
  userService.completeSignInViaEmailLink(values.email)?.then(() => {
    router.push({ name: 'home' });
  });
});

const router = useRouter();
onMounted(() => {
  let email = window.localStorage.getItem('emailForSignIn');

  if (email) {
    userService.completeSignInViaEmailLink(email)?.then(() => {
      router.push({ name: 'home' });
    });
  }
});
</script>

<style scoped></style>
