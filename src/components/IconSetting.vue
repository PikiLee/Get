<template>
  <div class="row q-my-md q-gutter-lg">
    <span>现头像</span>
    <q-avatar>
      <img :src="userStore.user?.icon" />
    </q-avatar>
  </div>
  <ImgSelect :imgInfos="options"></ImgSelect>
  <q-btn
    :loading="loading"
    label="提交"
    color="primary"
    @click="setUsernameAndIcon"
  ></q-btn>
</template>

<script setup lang="ts">
import ICON1 from '../assets/usericon/icon1.jpg';
import ICON2 from '../assets/usericon/icon2.jpg';
import ICON3 from '../assets/usericon/icon3.jpg';
import { useUserStore } from 'src/stores/userStore';
import ImgSelect from './ImgSelect.vue';
import userService from 'src/services/userService';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { object, string } from 'yup';
import { useQuasar } from 'quasar';

const userStore = useUserStore();
const $q = useQuasar();

const options = [
  {
    url: ICON1,
    title: '默认头像1',
  },
  {
    url: ICON2,
    title: '默认头像2',
  },
  {
    url: ICON3,
    title: '默认头像3',
  },
];

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
