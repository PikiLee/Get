<template>
  <q-page>
    <div class="q-pa-md q-mx-auto q-mt-xl" style="max-width: 400px">
      <q-card>
        <q-card-section>
          <!-- Email Form -->
          <Transition mode="out-in" name="rotateX">
            <EmailLink v-if="!isPasswordMethod"></EmailLink>
            <PasswordSignIn v-else></PasswordSignIn>
          </Transition>
        </q-card-section>
        <q-card-actions class="row justify-center">
          <q-btn
            label="密码登录"
            flat
            color="primary"
            @click="usePasswordMethod"
            v-if="!isPasswordMethod"
          ></q-btn>
          <q-btn
            label="邮件验证登录"
            flat
            color="primary"
            @click="useEmailLinkMethod"
            v-else
          ></q-btn>
          <q-btn
            label="Google账号登录"
            flat
            color="primary"
            @click="signInWithGoogle"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
} from 'firebase/auth';
import EmailLink from 'src/components/auth/EmailLink.vue';
import PasswordSignIn from 'src/components/auth/PasswordSignIn.vue';
import { useRouter } from 'vue-router';
import { auth } from 'src/services/firebase';

const isPasswordMethod = ref(false);

const usePasswordMethod = () => {
  isPasswordMethod.value = true;
};
const useEmailLinkMethod = () => {
  isPasswordMethod.value = false;
};

// google auth
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};

const router = useRouter();
onBeforeMount(() => {
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     getRedirectResult(auth)
  //       .then(() => {
  //         router.push({ name: 'home' });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // });
  // const auth = getAuth();
  getRedirectResult(auth)
    .then(() => {
      console.log('hr1');
      router.push({ name: 'home' });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      // ...
    });
});
</script>

<style scoped lang="scss"></style>
