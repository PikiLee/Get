<template>
  <div>
    <h2 class="text-h5 text-center" v-if="count > 0">邮件已发送，请查收</h2>
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
import userService from 'src/services/userService';
import { useCountdown } from 'src/utils/useCountdown';

const props = defineProps<{
  email: string;
}>();

const resend = () => {
  reset();
  resume();
  userService.signInOrLogInViaEmailLink(props.email);
};

const { count, reset, resume } = useCountdown(60);
resume();
</script>

<style scoped></style>
