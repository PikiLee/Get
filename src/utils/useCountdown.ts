import { ref } from 'vue';
import { useIntervalFn } from '@vueuse/core';

export const useCountdown = (duration: number) => {
  const count = ref(duration);

  const { pause, resume } = useIntervalFn(() => {
    count.value -= 1;
    if (count.value <= 0) {
      pause();
    }
  }, 1000);
  pause();

  const reset = () => {
    count.value = duration;
  };

  return { count, pause, resume, reset };
};
