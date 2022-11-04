<template>
  <q-page>
    <div class="q-pa-md q-mx-auto q-mt-xl" style="max-width: 400px">
      <q-card>
        <Transition>
          <q-card-section v-if="!hasSentEmail">
            <!-- <q-form @submit="onSubmit" class="q-gutter-md"> -->
            <BaseInput name="email" label="邮箱 *" type="email" />
            <q-btn
              label="发送验证邮件"
              @click="sendSignUpEmail"
              color="primary"
            ></q-btn>
            <!-- <BaseInput name="name" label="用户名 *" type="text" /> -->
            <!-- <BaseInput name="password" label="密码 *" type="password" /> -->

            <!-- <q-list class="row">
          <q-item-label>选择头像</q-item-label>
          <div class="row">
            <q-item
              class="col-4"
              tag="label"
              v-ripple
              v-for="ic in defaultIcons"
              :key="ic"
            >
              <q-item-section avatar>
                <q-radio
                  v-model="icon"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  :val="ic"
                />
              </q-item-section>
              <q-item-section>
                <q-avatar>
                  <img :src="ic" />
                </q-avatar>
              </q-item-section>
            </q-item>
          </div>
        </q-list> -->
            <div>
              <!-- <q-btn
                label="登录"
                type="submit"
                color="primary"
                :disable="!isValid"
              /> -->
              <!-- <q-btn
              label="重置"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
              /> -->
            </div>
            <p class="text-center">没有注册的邮箱将自动注册</p>
            <!-- </q-form> -->
          </q-card-section>
          <q-card-section v-else>
            <ResendEmail :email="email"></ResendEmail>
          </q-card-section>
        </Transition>
      </q-card>
      <!-- <div class="row q-my-md justify-center items-center">
        已经有帐号了？
        <q-btn flat :to="{ name: 'logIn' }" label="去登录吧" color="primary" />
      </div> -->
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { object, string } from 'yup';
import { useForm, useField } from 'vee-validate';
import userService from '../services/userService';
import { useQuasar } from 'quasar';
import { NewUser } from '../types/user';
import { computed, ref } from 'vue';
import ICON1 from '../assets/usericon/icon1.jpg';
import ICON2 from '../assets/usericon/icon2.jpg';
import ICON3 from '../assets/usericon/icon3.jpg';
import BaseInput from 'src/components/BaseInput.vue';
import { useRouter } from 'vue-router';
import ResendEmail from 'src/components/ResendEmail.vue';

const $q = useQuasar();
const router = useRouter();

// default icons
const defaultIcons = [ICON1, ICON2, ICON3];

const userSchema = object({
  email: string().test(async (value, context) => {
    if (!value) {
      return context.createError({
        message: '请输入邮箱',
      });
    } else if (!(await string().email().isValid(value))) {
      return context.createError({
        message: '请输入正确的邮箱',
      });
    } else if (await userService.checkIfEmailExists(value)) {
      return context.createError({
        message: '邮箱已注册',
      });
    } else {
      return true;
    }
  }),
  name: string().required('请输入用户名').min(2, '用户名至少为两位'),
  password: string().required('请输入密码').min(12, '密码至少为十二位'),
  icon: string().required(),
});

const { handleSubmit, handleReset, meta, validateField, values } =
  useForm<NewUser>({
    validationSchema: userSchema,
    initialValues: {
      email: '',
      name: '',
      password: '',
      icon: ICON1,
    },
  });

const { value: icon } = useField<string>('icon');

// submit values if they are valid
const onSubmit = handleSubmit((user) => {
  userService
    .createUser(user)
    .then(() => {
      $q.notify({
        message: '注册成功',
        color: 'positive',
      });
      router.push({ name: 'home' });
    })
    .catch(() => {
      $q.notify({
        message: '注册失败',
        color: 'negative ',
      });
    });
});

const email = ref('');

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

// form's validity status
const isValid = computed(() => meta.value.valid && meta.value.dirty);

const hasSentEmail = ref(false);
</script>

<style scoped></style>
