<template>
  <ProgressSpinner v-if="loading"></ProgressSpinner>
  <div v-else-if="error" class="flex flex-col items-center justify-center text-center p-6">
    <Message severity="error" :closable="false">
      <div class="font-bold text-lg mb-2">Data fetching error</div>
      <div>{{ 'Can\'t load data from the server.' }}</div>
    </Message>
  </div>
  <div v-else>
    <slot name="chart"></slot>
    <DataTable v-bind:filters="filters" v-on:update:filters="value => emit('onFiltersChange', value)"
               :value="processedData" scrollable scrollHeight="flex"
               @page="onPage" :first="(page - 1) * rows" :rows="rows" class="mt-12"
               paginator lazy :rowsPerPageOptions="[10, 25, 50, 100, 500]" :totalRecords="data.meta?.total"
               filterDisplay="row" dataKey="unique_id" :loading="loading">
      <template #header>
        <slot name="table-header"></slot>
      </template>
      <slot name="table-body"></slot>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";
import {ref, watch} from "vue";
import useAPI from "../hooks/useAPI.ts";
import type {Income} from "../types.ts";
import DataTable from "primevue/datatable";

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  processedData: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['onDataChange', 'onFiltersChange']);

const page = ref(1);
const rows = ref(50);

const query = ref({
  dateFrom: "",
  dateTo: "",
  page: "1",
  limit: "50",
});

watch([page, rows, () => props.filters.date.value], ([p, r, date]) => {
  const [dateFrom, dateTo] = date;

  function makeDateStr(date: Date) {
    return date.toISOString().split("T")[0]!;
  }

  query.value = {
    dateFrom: makeDateStr(dateFrom || new Date(0)),
    dateTo: makeDateStr(dateTo || new Date()),
    page: p.toString(),
    limit: r.toString(),
  };
}, {immediate: true});

const {data, error, loading} = useAPI<Income>("incomes", query);

watch([data], () => {
  emit('onDataChange', data.value.data);
})

function onPage(event: any) {
  page.value = event.page + 1;
  rows.value = event.rows
}

</script>