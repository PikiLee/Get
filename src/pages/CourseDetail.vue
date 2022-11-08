<template>
  <q-page class="">
    <q-table
      grid
      :rows="chapterStore.chapters"
      row-key="name"
      :pagination="{ rowsPerPage: 0 }"
      separator="vertical"
      hide-bottom
    >
      <!-- Table Top -->
      <template v-slot:top>
        <q-btn
          color="primary"
          icon="add"
          label="添加章节"
          @click="addChapterPrompt"
        />
      </template>
      <!-- Table Card -->
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card>
            <!-- Title -->
            <q-card-section>
              <header class="q-ma-none text-h4 row items-center">
                <q-badge class="q-mr-sm">
                  <span class="text-subtitle1">
                    {{ props.rowIndex + 1 }}
                  </span>
                </q-badge>
                <span class="col-grow text-center">
                  {{ props.row.name }}
                  <q-tooltip anchor="top middle" self="bottom middle">
                    点击编辑
                  </q-tooltip>
                  <q-popup-edit
                    v-model="props.row.name"
                    v-slot="scope"
                    auto-save
                  >
                    <q-input v-model="scope.value" dense autofocus />
                  </q-popup-edit>
                </span>
              </header>
            </q-card-section>

            <q-separator />

            <!-- Stage -->
            <div class="row justify-around items-center">
              <q-card-section>
                <q-badge :color="stages[props.row.stage].color">
                  <span class="text-subtitle2">
                    {{ stages[props.row.stage].label }}
                  </span>
                  <q-tooltip anchor="top middle" self="bottom middle">
                    点击编辑
                  </q-tooltip>
                </q-badge>
                <q-popup-edit
                  v-model="props.row.stage"
                  v-slot="scope"
                  auto-save
                  @save="(value: string) => {
                    chapterService.updateChapter(courseId, props.row.id, {stage: value})
                  }"
                >
                  <q-select
                    v-model="scope.value"
                    :options="stages"
                    label="进度"
                    map-options
                    emit-value
                  >
                  </q-select>
                </q-popup-edit>
              </q-card-section>

              <!-- Circular Progress -->
              <q-card-section>
                <q-circular-progress
                  rounded
                  :value="((props.row.stage + 1) / 5) * 100"
                  size="50px"
                  :thickness="0.22"
                  color="primary"
                  track-color="grey-3"
                  class="q-ma-md"
                />
              </q-card-section>
            </div>

            <!-- Date -->
            <div class="row justify-around items-center">
              <q-card-section>
                <p class="q-ma-none">
                  {{ date.formatDate(props.row.lastDate, 'YYYY-MM-DD') }}
                  <q-tooltip anchor="top middle" self="bottom middle">
                    点击编辑
                  </q-tooltip>
                </p>
                <q-popup-edit
                  v-model="props.row.lastDate"
                  v-slot="scope"
                  auto-save
                >
                  <q-date v-model="scope.value" />
                </q-popup-edit>
              </q-card-section>

              <q-card-section>
                {{
                  date.formatDate(
                    props.row.lastDate +
                      stages[props.row.stage].waitDays * 1000 * 60 * 60 * 24,
                    'YYYY-MM-DD'
                  )
                }}
              </q-card-section>
            </div>

            <q-separator />

            <!-- Actions -->
            <q-card-actions>
              <div
                class="row justify-center items-center"
                :style="{ width: '100%' }"
              >
                <q-btn
                  flat
                  color="negative"
                  icon="delete"
                  @click="confirmDelete(props.row.id)"
                />
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { date, useQuasar } from 'quasar';
import { onBeforeMount } from 'vue';
import chapterService from 'src/services/chapterService';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useChapterStore } from './../stores/chapterStore';

const route = useRoute();
const $q = useQuasar();
const chapterStore = useChapterStore();
const courseId =
  typeof route.params.courseId === 'string'
    ? route.params.courseId
    : route.params.courseId[0];

onBeforeMount(() => {
  chapterService.fetchChapters(courseId);
});

onBeforeRouteUpdate(() => {
  chapterService.fetchChapters(courseId);
});

const stages = [
  {
    label: '已学习',
    value: 0,
    color: 'green',
    waitDays: 1,
  },
  {
    label: '已第一次复习',
    value: 1,
    color: 'blue',
    waitDays: 7,
  },
  {
    label: '已第二次复习',
    value: 2,
    color: 'orange',
    waitDays: 14,
  },
  {
    label: '已第三次复习',
    value: 3,
    color: 'deep-purple',
    waitDays: 28,
  },
  {
    label: '已第四次复习',
    value: 4,
    color: 'grey',
    waitDays: 0,
  },
];

function confirmDelete(chapterId: string) {
  $q.dialog({
    title: 'Confirm',
    message: '真的要删除该章节吗',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      // console.log('>>>> OK')
      chapterService
        .deleteChapter(courseId, chapterId)
        .then(() => {
          $q.notify({
            message: '删除成功',
            color: 'green',
          });
        })
        .catch((err) => {
          $q.notify({
            message: '删除失败' + err,
            color: 'red',
          });
        });
    })
    .onOk(() => {
      // console.log('>>>> second OK catcher')
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}

function addChapterPrompt() {
  $q.dialog({
    title: '添加章节',
    message: '请输入章节名',
    prompt: {
      model: '',
      isValid: (val) => val.length > 0, // << here is the magic
      type: 'text', // optional
    },
    cancel: true,
    persistent: true,
  }).onOk((data) => {
    // console.log('>>>> OK, received', data)
    chapterService
      .postChapter(courseId, {
        name: data,
        stage: 0,
        lastDate: Date.now(),
      })
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
}
</script>

<style lang="scss" scoped></style>
