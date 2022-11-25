<template>
  <q-page class="q-pb-xl">
    <div>
      <h2 class="text-h5 text-center">
        {{ courseStore.getCourseInfo(courseId)?.name }}
      </h2>
      <q-list bordered separator id="chapters-draggable-container">
        <q-item
          clickable
          v-ripple
          v-for="chapter in chapterStore.chapters"
          :key="chapter.id"
          class="chapter-card-draggable q-my-md"
        >
          <div class="row q-gutter-y-md full-width">
            <!-- Drag Handle -->
            <div class="col-xs-1 col-md-1 row items-center justify-start">
              <q-icon
                name="menu"
                color="grey-7"
                class="my-handle"
                size="large"
              ></q-icon>
            </div>

            <!-- Stage -->
            <div class="col-xs-5 col-md-1 row items-center justify-center">
              <q-badge :color="stages[chapter.stage].color">
                <span class="text-subtitle2">
                  {{ stages[chapter.stage].label }}
                </span>
                <q-tooltip anchor="top middle" self="bottom middle">
                  点击编辑
                </q-tooltip>
              </q-badge>
              <q-popup-edit
                v-model="chapter.stage"
                v-slot="scope"
                auto-save
                @save="(value: string) => {
            chapterService.updateChapter(courseId, chapter.id, {stage: value, lastDate: Date.now()}, {updateStore: true})
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
            </div>

            <!-- Due or Not -->
            <div class="col-xs-6 col-md-2 row items-center justify-center">
              <q-chip
                v-if="
                  date.isSameDate(
                    date.addToDate(new Date(chapter.lastDate), {
                      days: stages[chapter.stage].waitDays,
                    }),
                    new Date(),
                    'date'
                  )
                "
                color="primary"
                text-color="white"
                >今日需复习</q-chip
              >
              <q-chip v-else>未到复习时间</q-chip>
            </div>

            <!-- title -->
            <div class="col-xs-12 col-md-4 row items-center justify-center">
              <h5 class="text-center q-ma-none">
                {{ chapter.name }}
                <q-tooltip anchor="top middle" self="bottom middle">
                  点击编辑
                </q-tooltip>
                <q-popup-edit
                  v-model="chapter.name"
                  v-slot="scope"
                  auto-save
                  @save="(value: string) => {
                chapterService.updateChapter(courseId, chapter.id, {name: value})
              }"
                >
                  <q-input v-model="scope.value" dense autofocus />
                </q-popup-edit>
              </h5>
            </div>

            <!-- Last Date -->
            <div class="col-xs-6 col-md-1 row items-center justify-center">
              <q-item-label class="text-caption"> 上次复习时间 </q-item-label>
              <p class="q-ma-none">
                {{ date.formatDate(chapter.lastDate, 'YYYY-MM-DD') }}
                <q-tooltip anchor="top middle" self="bottom middle">
                  点击编辑
                </q-tooltip>
                <q-popup-edit
                  :modelValue="date.formatDate(chapter.lastDate, 'YYYY/MM/DD')"
                  v-slot="scope"
                  auto-save
                  @save="
                  (value: string) => {
                    chapterService.updateChapter(courseId, chapter.id, {
                      lastDate: date.extractDate(value, 'YYYY/MM/DD').valueOf(),
                    }, {updateStore: true});
                  }
                "
                >
                  <q-date v-model="scope.value" />
                </q-popup-edit>
              </p>
            </div>

            <!-- Next Date -->
            <div class="col-xs-6 col-md-1 row items-center justify-center">
              <q-item-label class="text-caption"> 下次复习时间 </q-item-label>
              <q-item-label>
                {{
                  Math.max(
                    date.getDateDiff(
                      date.addToDate(new Date(chapter.lastDate), {
                        days: stages[chapter.stage].waitDays,
                      }),
                      new Date(),
                      'days'
                    ),
                    0
                  ) + '天后'
                }}
              </q-item-label>
            </div>

            <!-- Progress Circle -->
            <div class="col-xs-6 col-md-1 row items-center justify-center">
              <q-circular-progress
                rounded
                :value="((chapter.stage + 1) / 5) * 100"
                size="30px"
                :thickness="0.22"
                color="primary"
                track-color="grey-3"
                class="q-ma-md"
              />
            </div>

            <!-- Delete Btn -->
            <div class="col-xs-6 col-md-1 row items-center justify-center">
              <div
                class="row justify-center items-center"
                :style="{ width: '100%' }"
              >
                <q-btn
                  flat
                  color="negative"
                  icon="delete"
                  @click="confirmDelete(chapter.id)"
                />
              </div>
            </div>
          </div>
        </q-item>
      </q-list>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        color="primary"
        icon="add"
        label="添加章节"
        @click="addChapterPrompt"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { date, useQuasar } from 'quasar';
import { onMounted } from 'vue';
import chapterService from 'src/services/chapterService';
import { useRoute } from 'vue-router';
import { useChapterStore } from './../stores/chapterStore';
import Sortable from 'sortablejs';
import { useCourseStore } from 'src/stores/courseStore';

const route = useRoute();
const $q = useQuasar();
const chapterStore = useChapterStore();
const courseId =
  typeof route.params.courseId === 'string'
    ? route.params.courseId
    : route.params.courseId[0];
const courseStore = useCourseStore();

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
    title: '删除',
    message: '真的要删除该章节吗',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      chapterService
        .deleteChapter(courseId, chapterId, {
          showLoading: true,
        })
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
      isValid: (val) => val.length > 0, // <<script here is the magic
      type: 'text', // optional
    },
    cancel: true,
    persistent: true,
  }).onOk((data) => {
    chapterService
      .postChapter(
        courseId,
        {
          name: data,
          stage: 0,
          lastDate: Date.now(),
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
}

// drag
onMounted(() => {
  new Sortable(
    document.querySelector('#chapters-draggable-container') as HTMLElement,
    {
      onEnd: function (evt) {
        if (
          evt.oldDraggableIndex !== undefined &&
          evt.newDraggableIndex !== undefined
        ) {
          chapterService.exchangeOrder(
            courseId,
            evt.oldDraggableIndex,
            evt.newDraggableIndex
          );
        }
      },
      handle: '.my-handle',
      draggable: '.chapter-card-draggable',
    }
  );
});
</script>

<style lang="scss" scoped></style>
