<template>
  <q-page>
    <q-table
      grid
      :rows="courseStore.courses"
      row-key="id"
      title="课程"
      hide-bottom
      card-container-class="q-col-gutter-md q-px-md"
    >
      <template v-slot:top>
        <div>
          <q-checkbox
            v-model="displayOptions.showFinished"
            label="显示已完成的课程"
          />
        </div>
        <div>
          <q-checkbox
            v-model="displayOptions.showArchived"
            label="显示搁置中的课程"
          />
        </div>
        <q-btn color="secondary" icon-right="add" label="添加新课程">
          <q-popup-proxy>
            <div class="q-pa-md" v-close-popup="isNewCourseNameInputOpen">
              <q-input
                v-model="newCourseName"
                dense
                autofocus
                counter
                label="请输入课程名"
                @keyup.enter="addCourse"
                :rules="[(val) => !!val || '必填']"
              />
            </div>
          </q-popup-proxy>
        </q-btn>
      </template>
      <template v-slot:item="props">
        <div class="col-xs-4">
          <q-card :style="{ width: '100%' }">
            <q-card-section horizontal>
              <q-img src="https://placeimg.com/500/300/nature" class="col-xs-5">
              </q-img>
              <q-card-section class="col-xs-7">
                <q-card-section>
                  <header class="relative-position text-h5">
                    {{ props.row.name }}
                    <q-badge
                      :color="courseStatuses[props.row.status].color"
                      floating
                      align="bottom"
                      >{{ courseStatuses[props.row.status].label }}</q-badge
                    >
                  </header>
                </q-card-section>
                <q-card-actions class="row justify-end">
                  <q-btn
                    push
                    color="white"
                    text-color="primary"
                    round
                    icon="east"
                  />
                </q-card-actions>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import courseService from '../services/courseService';
import { useQuasar } from 'quasar';
import { useCourseStore } from 'src/stores/courseStore';

const courseStore = useCourseStore();

const $q = useQuasar();

onBeforeMount(() => {
  courseService.fetchCourses();
});

const courseStatuses = [
  {
    label: '进行中',
    value: 0,
    color: 'green',
  },
  {
    label: '已完成',
    value: 1,
    color: 'grey',
  },
  {
    label: '搁置中',
    value: 2,
    color: 'blue',
  },
];

const displayOptions = reactive({
  showFinished: true,
  showArchived: true,
});

const newCourseName = ref('');
const isNewCourseNameInputOpen = ref(0);
const addCourse = () => {
  if (newCourseName.value === '') return;

  isNewCourseNameInputOpen.value = 1;
  courseService
    .postCourse({
      name: newCourseName.value,
      status: 0,
    })
    .then(() => {
      $q.dialog({
        title: '添加成功',
        message: '添加成功',
      });
      newCourseName.value = '';
    })
    .catch((err) => {
      $q.dialog({
        title: '添加失败',
        message: '失败原因' + err,
      });
    });

  setTimeout(() => {
    isNewCourseNameInputOpen.value = 0;
  }, 500);
};
</script>

<style scoped></style>
