<template>
  <div :id="id" class="vxe_table" :style="{ height: tableHeight + 'px' }">
    <Grid
      v-bind="gridOptions"
      :loading="isLoading"
      :data="data.data"
      :columns="handleColumns(columns)"
    >
      <template #operate="{ row }">
        <slot name="operate" :record="row" />
      </template>
    </Grid>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, h } from 'vue';
import { Grid } from 'vxe-table';
import { useTableHeight } from './hooks/useTableHeight';
import { useDebounceFn } from '@vueuse/core';

const {
  id = 'table',
  data,
  columns,
  options,
  isLoading = false,
  offsetHeight = 0,
  isResize = true
} = defineProps();

const tableHeight = ref(0);
const gridOptions = reactive({
  border: true,
  showOverflow: true,
  showHeaderOverflow: true,
  autoResize: true,
  stripe: true,
  size: 'small',
  rowConfig: {
    useKey: true,
    isHover: true,
    isCurrent: true
  },
  sortConfig: {
    trigger: 'cell'
  },
  columnConfig: {
    resizable: true
  },
  scrollX: {
    enabled: true
  },
  scrollY: {
    enabled: true
  },
  ...options
});

onMounted(() => {
  tableHeight.value = useTableHeight(id, offsetHeight);
  if (isResize) {
    window.addEventListener('resize', useDebounceFn(() => {
      tableHeight.value = useTableHeight(id, offsetHeight);
    }, 200));
  }
});

onUnmounted(() => {
  if (isResize) {
    window.removeEventListener('resize', useDebounceFn(() => {
      tableHeight.value = useTableHeight(id, offsetHeight);
    }, 200));
  }
});

const handleColumns = (cols) => {
  if (!cols) return undefined;

  for (let item of cols) {
    item.minWidth = item.minWidth || 50;
    if (item.slots && Object.keys(item.slots).length > 0) continue;
    if (!item.slots) item.slots = {};
    item.slots.default = ({ row }) => [
      h('span', {
        innerHTML: row?.[item.field] || '-'
      })
    ];
  }
  return cols;
};
</script>
