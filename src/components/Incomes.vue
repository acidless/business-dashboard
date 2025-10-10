<template>
  <ProgressSpinner v-if="loading"></ProgressSpinner>
  <div v-else-if="error" class="flex flex-col items-center justify-center text-center p-6">
    <Message severity="error" :closable="false">
      <div class="font-bold text-lg mb-2">Data fetching error</div>
      <div>{{ 'Can\'t load data from the server.' }}</div>
    </Message>
  </div>
  <div v-else>
    <FieldChart v-if="filteredData.length" label-field="date" data-field-title="Quantity" data-field="quantity" :data="filteredData"/>
    <DataTable v-model:filters="filters" :value="filteredData" scrollable scrollHeight="flex"
               @page="onPage" :first="(page - 1) * rows" :rows="rows" class="mt-12"
               paginator lazy :rowsPerPageOptions="[10, 25, 50, 100, 500]" :totalRecords="data.meta?.total"
               filterDisplay="row" dataKey="unique_id" :loading="loading"
               :globalFilterFields="['warehouse_name']">
      <template #header>
        <div class="flex justify-between">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilter()"/>
        </div>

        <Message v-if="filtersApplied" severity="info" :closable="false" class="mt-3">
          Filters are applied only to the current page.
        </Message>
      </template>
      <Column field="barcode" header="Barcode" filterField="barcode" :filter="true" :showFilterMenu="false"
              style="min-width: 8rem">
        <template #body="{ data }">
          {{ data.barcode }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Barcode"
              @input="filterCallback()"
              class="p-column-filter"
          />
        </template>
      </Column>
      <Column field="date" header="Date" filterField="date" :filter="true" :showFilterMenu="false"
              style="min-width: 10rem">
        <template #body="{ data }">{{ data.date || 'N/A' }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <DatePicker
              v-model="filterModel.value"
              selectionMode="range"
              dateFormat="yy-mm-dd"
              placeholder="Select date range"
              @update:modelValue="filterCallback()"
              class="p-column-filter w-full"
          />
        </template>
      </Column>
      <Column
          header="Warehouse Name"
          field="warehouse_name"
          filterField="warehouse_name"
          :filter="true"
          :showFilterMenu="false"
          style="min-width: 14rem"
      >
        <template #body="{ data }">
          <span>{{ data.warehouse_name }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
              v-model="filterModel.value"
              :options="warehouseOptions"
              optionLabel="label"
              optionValue="value"
              data-key="key"
              :show-toggle-all="false"
              placeholder="Select warehouses"
              :maxSelectedLabels="1"
              selectedItemsLabel="{0} warehouses selected"
              @change="filterCallback()"
              class="p-column-filter"
          />
        </template>
      </Column>
      <Column header="Article" field="supplier_article" filterField="supplier_article" :filter="true"
              :showFilterMenu="false" style="min-width: 14rem">
        <template #body="{ data }">
          <span>{{ data.supplier_article }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Article"
              @input="filterCallback()"
              class="p-column-filter"
          />
        </template>
      </Column>
      <Column field="tech_size" header="Tech Size" style="min-width: 14rem">
        <template #body="{ data }">
          <span>{{ data.tech_size }}</span>
        </template>
      </Column>
      <Column field="quantity" header="Quantity"
              style="min-width: 8rem">
        <template #body="{ data }">
          <span>{{ data.quantity }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import useAPI from "../hooks/useAPI.ts";
import {type Income} from "../types.ts";
import {computed, ref, watch} from "vue";
import FieldChart from "./FieldChart.vue";
import InputText from 'primevue/inputtext';

const filters = ref({
  warehouse_name: {value: [] as string[]},
  date: {value: [new Date(0), new Date()]},
  barcode: {value: ""},
  supplier_article: {value: ""},
});

const filtersApplied = computed(() => {
  const f = filters.value;
  return (
      f.barcode.value ||
      f.supplier_article.value ||
      f.warehouse_name.value.length > 0
  );
});

const page = ref(1);
const rows = ref(50);

const query = ref({
  dateFrom: "",
  dateTo: "",
  page: "1",
  limit: "50",
});

watch([page, rows, () => filters.value.date.value], ([p, r, date]) => {
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

const normalizedData = computed(() => {
  return data.value.data.map(item => ({
    ...item,
    unique_id: `${item.nm_id}-${item.income_id}`
  }));
});

const filteredData = computed(() => {
  return normalizedData.value.filter((item) => {
    const barcodeMatch = !filters.value.barcode.value ||
        item.barcode.toString().toLowerCase().trim().includes(filters.value.barcode.value.toLowerCase());

    const articleMatch = !filters.value.supplier_article.value ||
        item.supplier_article.toLowerCase().trim().includes(filters.value.supplier_article.value.toLowerCase());

    const warehouseMatch = filters.value.warehouse_name.value.length === 0 ||
        filters.value.warehouse_name.value.includes(item.warehouse_name);

    return barcodeMatch && articleMatch && warehouseMatch;
  });
});

const warehouseOptions = computed(() => {
  const unique = [...new Set(data.value.data.map((item: Income) => item.warehouse_name))];
  return unique
      .filter(name => name)
      .map((name, index) => ({
        label: name,
        value: name,
        key: `${name}-${index}`
      }));
});


function clearFilter() {
  filters.value.warehouse_name.value = [];
  filters.value.date.value = [new Date(0), new Date()];
  filters.value.barcode.value = "";
  filters.value.supplier_article.value = "";
}

function onPage(event: any) {
  page.value = event.page + 1;
  rows.value = event.rows
}

</script>