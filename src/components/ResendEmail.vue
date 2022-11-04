<template>
  <div>
    <h2 class="text-h5 text-center" v-if="count > 0">邮件已发送</h2>
    <p class="text-center" v-if="count > 0">{{ count }}秒后可以重新发送邮件</p>
    <div class="row justify-center">
      <q-btn
        label="重新发送邮件"
        type="button"
        color="primary"
        :disable="count !== 0"
        @click="resend"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import userService from 'src/services/userService';
import { useIntervalFn } from '@vueuse/core';

const resendInterval = 3;

const count = ref(resendInterval);

const { pause, resume } = useIntervalFn(() => {
  count.value -= 1;
  if (count.value <= 0) {
    pause();
  }
}, 1000);

const props = defineProps<{
  email: string;
}>();

const resend = () => {
  count.value = resendInterval;
  resume();
  userService.signInOrLogInViaEmailLink(props.email);
};
</script>

<style scoped></style>
