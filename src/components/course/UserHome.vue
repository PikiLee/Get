<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn
      fab
      color="primary"
      icon-right="add"
      label="添加新课程"
      @click="addCourse"
    />
  </q-page-sticky>
  <q-table
    grid
    :rows="courses"
    row-key="id"
    title="课程"
    hide-bottom
    card-container-class="q-col-gutter-md q-px-md"
    :pagination="{ rowsPerPage: 0 }"
  >
    <template v-slot:top>
      <div class="row justify-between" :style="{ width: '100%' }">
        <div>
          <q-checkbox
            v-model="displayOptions.showFinished"
            label="显示已完成的课程"
          />
          <q-checkbox
            v-model="displayOptions.showArchived"
            label="显示搁置中的课程"
          />
        </div>
      </div>
    </template>
    <template v-slot:item="props">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card :style="{ width: '100%' }" class="relative-position">
          <q-btn
            round
            flat
            color="white"
            icon="delete"
            class="absolute-top-right"
            @click="deleteCourse(props.row.id)"
            :style="{ zIndex: 100 }"
          >
          </q-btn>
          <q-img
            :src="`https://source.unsplash.com/collection/1277197/500x300/?sig=${props.row.coverId}`"
            class="col-xs-5 rounded-borders"
            :ratio="16 / 9"
          >
            <div class="absolute-bottom text-h5 text-center">
              <span>
                {{ props.row.name }}
                <q-popup-edit
                  v-model="props.row.name"
                  title="编辑课程名"
                  auto-save
                  v-slot="scope"
                  @save="(value: string) => {
                      courseService.updateCourse(props.row.id, {name: value})
                    }"
                >
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    counter
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </span>
            </div>
          </q-img>
          <q-card-section>
            <div class="row justify-around items-center">
              <q-chip
                :color="courseStatuses[props.row.status].color"
                text-color="white"
                class="cursor-pointer"
                icon="edit_square"
              >
                {{ courseStatuses[props.row.status].label }}
                <q-popup-edit
                  v-model.number="props.row.status"
                  title="编辑状态"
                  auto-save
                  v-slot="scope"
                  @save="(value: number) => {
                      courseService.updateCourse(props.row.id, {status: value})
                    }"
                >
                  <q-select
                    filled
                    v-model="scope.value"
                    :options="courseStatuses"
                    label="状态"
                    map-options
                    emit-value
                  />
                </q-popup-edit>
              </q-chip>
              <q-btn
                push
                text-color="grey-7"
                round
                flat
                icon="chevron_right"
                @click="navToCourse(props.row.id)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { onBeforeMount, computed, reactive } from 'vue';
import courseService from '../../services/courseService';
import { useQuasar } from 'quasar';
import { useCourseStore } from 'src/stores/courseStore';
import { useRouter } from 'vue-router';

const router = useRouter();

const courseStore = useCourseStore();

const $q = useQuasar();

onBeforeMount(() => {
  if (courseStore.courses.length === 0) {
    courseService.fetchCourses();
  }
});

const displayOptions = reactive({
  showFinished: true,
  showArchived: true,
});

const courses = computed(() => {
  return courseStore.courses.filter((course) => {
    if (!displayOptions.showFinished && course.status === 1) {
      return false;
    }
    if (!displayOptions.showArchived && course.status === 2) {
      return false;
    }
    return true;
  });
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

const addCourse = () => {
  $q.dialog({
    title: '添加课程',
    message: '请输入课程名',
    prompt: {
      model: '',
      type: 'text',
      isValid: (val) => val.length > 0, // optional
    },
    cancel: true,
    persistent: true,
  }).onOk((data) => {
    courseService
      .postCourse(
        {
          name: data,
          status: 0,
        },
        {
          showLoading: true,
        }
      )
      .then(() => {
        $q.notify({
          message: '添加成功',
          color: 'positive',
        });
      })
      .catch((err) => {
        $q.notify({
          message: '添加失败:' + err,
          color: 'negative',
        });
      });
  });
};

const navToCourse = (courseId: number) => {
  router.push({ name: 'course', params: { courseId } });
};

// delete course
const deleteCourse = (courseId: string) => {
  courseService
    .deleteCourse(courseId, {
      updateStore: true,
      showLoading: true,
    })
    .then(() => {
      $q.notify({
        message: '删除成功',
        color: 'positive',
      });
    })
    .catch((err) => {
      $q.notify({
        message: '删除失败:' + err,
        color: 'negative',
      });
    });
};
</script>

<!-- <style scoped></style> -->
