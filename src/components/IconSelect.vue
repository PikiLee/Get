<template>
  <q-list class="row">
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
            v-model="value"
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
  </q-list>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { toRef } from 'vue';
import ICON1 from '../assets/usericon/icon1.jpg';
import ICON2 from '../assets/usericon/icon2.jpg';
import ICON3 from '../assets/usericon/icon3.jpg';

const defaultIcons = [ICON1, ICON2, ICON3];

const { value } = useField<string>('icon');
</script>

<style scoped></style>
