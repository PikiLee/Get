<template>
  <q-page class="">
    <div class="relative-position">
      <q-img src="../assets/bg/book.jpg" height="15rem" />
      <div
        class="row no-wrap text-white justify-between absolute-bottom q-pa-sm"
      >
        <h2 class="text-h6 q-ma-none">我的世界</h2>
        <time class="text-subtitle1">monday 1</time>
      </div>
    </div>

    <q-table
      grid
      :rows="chapterStore.chapters"
      row-key="name"
      :pagination="{ rowsPerPage: 0 }"
      separator="vertical"
      hide-bottom
    >
      <template v-slot:top="props">
        <q-btn
          color="primary"
          icon="add"
          label="添加章节"
          @click="addChapterPrompt"
        />
        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card>
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
                >
                  <q-select
                    v-model="scope.value"
                    :options="stages"
                    label="进度"
                    map-options
                    emit-value
                  />
                </q-popup-edit>
              </q-card-section>

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
                {{ date.formatDate(props.row.nextDate, 'YYYY-MM-DD') }}
              </q-card-section>
            </div>

            <q-separator />

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
import { onBeforeMount, ref, watch } from 'vue';
import chapterService from 'src/services/chapterService';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useChapterStore } from './../stores/chapterStore';

const route = useRoute();

const $q = useQuasar();

const chapterStore = useChapterStore();

const columns = [
  {
    name: 'chapter',
    required: true,
    label: '章节',
    align: 'left',
    field: 'chapter',
    sortable: true,
  },
  {
    name: 'stage',
    required: true,
    align: 'left',
    label: '进度',
    field: 'stage',
    sortable: true,
  },
  {
    name: 'lastDate',
    required: true,
    align: 'left',
    label: '上次复习时间',
    field: 'lastDate',
    sortable: true,
  },
  {
    name: 'nextDate',
    required: true,
    align: 'left',
    label: '下次复习时间',
    field: 'nextDate',
    sortable: true,
  },
];

onBeforeMount(() => {
  chapterService.fetchChapters(route.params.courseId);
});

onBeforeRouteUpdate(() => {
  chapterService.fetchChapters(route.params.courseId);
});

const stages = [
  {
    label: '已学习',
    value: 0,
    color: 'green',
  },
  {
    label: '已第一次复习',
    value: 1,
    color: 'blue',
  },
  {
    label: '已第二次复习',
    value: 2,
    color: 'orange',
  },
  {
    label: '已第三次复习',
    value: 3,
    color: 'deep-purple',
  },
  {
    label: '已第四次复习',
    value: 4,
    color: 'grey',
  },
];

const deleteRow = (id: number) => {
  rows.value = rows.value.filter((row) => row.id !== id);
};

function confirmDelete(id: number) {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to turn on the wifi?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      // console.log('>>>> OK')
      deleteRow(id);
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
    const courseId = route.params.courseId;
    chapterService
      .postChapter(courseId, {
        name: data,
        stage: 0,
        lastDate: Date.now(),
      })
      .then(() => {
        $q.dialog({
          title: '添加成功',
          message: '添加成功',
        });
      })
      .catch((err) => {
        $q.dialog({
          title: '添加失败',
          message: '失败原因' + err,
        });
      });
  });
}

chapterStore.$subscribe((mutation) => {
  chapterService.updateChapter(route.params.courseId, mutation.events.target);
});

// watch(() =>  chapterStore.$state.chapters, (chapters) => {

// })
</script>

<style lang="scss" scoped>
.my-sticky-header-table {
  /* height or max-height is important */
  height: 310px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}
</style>
