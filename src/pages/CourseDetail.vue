<template>
  <q-page class="">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        color="primary"
        icon="add"
        label="添加章节"
        @click="addChapterPrompt"
      />
    </q-page-sticky>
    <div>
      <q-list bordered separator id="chapters-draggable-container">
        <q-item
          clickable
          v-ripple
          v-for="chapter in chapterStore.chapters"
          :key="chapter.id"
          class="chapter-card-draggable"
        >
          <q-item-section side>
            <q-icon name="menu" color="grey-7" class="my-handle"></q-icon>
          </q-item-section>
          <q-item-section avatar
            ><q-badge :color="stages[chapter.stage].color">
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
            chapterService.updateChapter(courseId, chapter.id, {stage: value})
          }"
            >
              <q-select
                v-model="scope.value"
                :options="stages"
                label="进度"
                map-options
                emit-value
              >
              </q-select> </q-popup-edit
          ></q-item-section>
          <q-item-section>
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
          </q-item-section>
          <q-item-section side>
            <q-item-label> 上次复习时间 </q-item-label>
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
                    chapterStore.updateChapter(chapter.id, date.extractDate(value, 'YYYY/MM/DD').valueOf())
                    chapterService.updateChapter(courseId, chapter.id, {
                      lastDate: date.extractDate(value, 'YYYY/MM/DD').valueOf(),
                    });
                  }
                "
              >
                <q-date v-model="scope.value" />
              </q-popup-edit>
            </p>
          </q-item-section>

          <q-item-section side>
            <q-item-label> 下次复习时间 </q-item-label>
            {{
              date.formatDate(
                chapter.lastDate +
                  stages[chapter.stage].waitDays * 1000 * 60 * 60 * 24,
                'YYYY-MM-DD'
              )
            }}
          </q-item-section>

          <q-item-section avatar>
            <q-circular-progress
              rounded
              :value="((chapter.stage + 1) / 5) * 100"
              size="30px"
              :thickness="0.22"
              color="primary"
              track-color="grey-3"
              class="q-ma-md"
            />
          </q-item-section>
          <q-item-section side>
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
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { date, useQuasar } from 'quasar';
import { onBeforeMount, onMounted } from 'vue';
import chapterService from 'src/services/chapterService';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useChapterStore } from './../stores/chapterStore';
import Sortable from 'sortablejs';

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
      isValid: (val) => val.length > 0, // <<script here is the magic
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

// drag
onMounted(() => {
  new Sortable(
    document.querySelector('#chapters-draggable-container') as HTMLElement,
    {
      onEnd: function (evt) {
        console.log(evt);
        if (
          evt.oldDraggableIndex !== undefined &&
          evt.newDraggableIndex !== undefined
        ) {
          chapterService.exchangeOrder(
            courseId,
            evt.newDraggableIndex,
            evt.oldDraggableIndex
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
