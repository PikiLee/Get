<template>
  <div class="row q-my-md q-gutter-lg">
    <span>现头像</span>
    <q-avatar>
      <img :src="userStore.user?.icon" />
    </q-avatar>
  </div>
  <ImgSelect></ImgSelect>
  <q-btn
    :loading="loading"
    label="提交"
    color="primary"
    @click="setUsernameAndIcon"
  ></q-btn>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/userStore';
import ImgSelect from './IconSelect.vue';
import userService from 'src/services/userService';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { object, string } from 'yup';
import { useQuasar } from 'quasar';
import ICON1 from '../assets/usericon/icon1.jpg';

const userStore = useUserStore();
const $q = useQuasar();

const userSchema = object({
  icon: string().required(),
});

const { validateField, values } = useForm({
  validationSchema: userSchema,
  initialValues: {
    icon: userStore.user?.icon || ICON1,
  },
});
const loading = ref(false);

const setUsernameAndIcon = () => {
  validateField('icon').then((res) => {
    if (res.valid) {
      loading.value = true;
      userService
        .updateUsernameAndIconUrl({
          name: null,
          icon: values.icon,
        })
        .then(() => {
          $q.notify({
            message: '修改成功',
            color: 'positive',
          });
        })
        .catch(() => {
          $q.notify({
            message: '修改失败',
            color: 'negative',
          });
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
</script>

<style scoped></style>
