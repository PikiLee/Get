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
      </q-card>
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

const router = useRouter();

const userSchema = object({
  email: string().required('请输入邮箱').email('请输入正确的邮箱'),
});

const { validateField, values } = useForm({
  validationSchema: userSchema,
  initialValues: {
    email: '',
  },
});

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
