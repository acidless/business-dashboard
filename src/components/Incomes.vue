<template>
  <Dashboard endpoint="incomes" :processed-data="processedData" @on-data-change="onDataChange" @on-filters-change="onFiltersChange" :filters="filters">
    <template #chart>
      <FieldChart v-if="processedData.length" label-field="date" data-field-title="Quantity" data-field="quantity" :data="processedData"/>
    </template>
    <template #table-header>
      <div class="flex justify-between">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilter()"/>
      </div>

      <Message v-if="filtersApplied" severity="info" :closable="false" class="mt-3">
        Filters are applied only to the current page.
      </Message>
    </template>
    <template #table-body>
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
    </template>
  </Dashboard>
</template>

<script setup lang="ts">
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import {computed, ref} from "vue";
import {type Income} from "../types.ts";
import Dashboard from "./Dashboard.vue";
import FieldChart from "./FieldChart.vue";

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

const baseData = ref<Income[]>([]);
const processedData = ref<Income[]>([]);

function onDataChange(data: Income[]) {
  baseData.value = data.map((item) => ({
    ...item,
    unique_id: `${item.nm_id}-${item.income_id}`
  }));

  filterData();
}

function filterData() {
  processedData.value = baseData.value.filter((item) => {
    const barcodeMatch = !filters.value.barcode.value ||
        item.barcode.toString().toLowerCase().trim().includes(filters.value.barcode.value.toLowerCase());

    const articleMatch = !filters.value.supplier_article.value ||
        item.supplier_article.toLowerCase().trim().includes(filters.value.supplier_article.value.toLowerCase());

    const warehouseMatch = filters.value.warehouse_name.value.length === 0 ||
        filters.value.warehouse_name.value.includes(item.warehouse_name);

    return barcodeMatch && articleMatch && warehouseMatch;
  });
}

const warehouseOptions = computed(() => {
  const unique = [...new Set(baseData.value.map((item: Income) => item.warehouse_name))];
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

function onFiltersChange(newFilters: typeof filters.value) {
  filters.value = newFilters;
  filterData();
}

</script>