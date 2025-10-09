<template>
  <ProgressSpinner v-if="loading"></ProgressSpinner>
  <div v-else-if="data.data.length">
    <FieldChart label-field="date" data-field-title="Quantity" data-field="quantity" :data="data.data"/>
    <DataTable v-model:filters="filters" :value="data.data" scrollable scrollHeight="flex"
               @page="onPage" :first="(page - 1) * rows" :rows="rows"
               paginator lazy :rowsPerPageOptions="[10, 25, 50, 100, 500]" :totalRecords="data.meta?.total"
               filterDisplay="row" dataKey="nm_id" :loading="loading"
               :globalFilterFields="['warehouse_name']">
      <template #header>
        <div class="flex justify-between">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilter()"/>
        </div>
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
import MultiSelect from 'primevue/multiselect';
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import useAPI from "../hooks/useAPI.ts";
import {type Income} from "../types.ts";
import {computed, ref} from "vue";
import FieldChart from "./FieldChart.vue";
import InputText from 'primevue/inputtext';

const filters = ref({
  warehouse_name: {value: []},
  date: {value: [new Date(0), new Date()]},
  barcode: {value: ""},
  supplier_article: {value: ""},
})
const page = ref(1);
const rows = ref(50);

const query = computed(() => {
  return {
    dateFrom: "1970-01-01",
    dateTo: new Date().toISOString().split("T")[0]!,
    page: page.value.toString(),
    limit: rows.value.toString()
  }
});

const {data, error, loading} = useAPI<Income>("incomes", query);

const warehouseOptions = computed(() =>
    [...new Set(data.value.data.map((item: Income) => item.warehouse_name))]
        .filter(name => name)
        .map(name => ({label: name, value: name}))
);


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