<template>
  <Dashboard endpoint="incomes" :processed-data="processedData" @on-data-change="onDataChange"
             @on-filters-change="onFiltersChange" :filters="filters">
    <template #chart>
      <FieldChart v-if="processedData.length" label-field="date" data-field-title="Quantity" data-field="quantity"
                  :data="processedData"/>
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
import {useFilters} from "../hooks/useFilters.ts";

const baseData = ref<Income[]>([]);
const {filters, filtersApplied, clearFilter, filterData, onFiltersChange, processedData} = useFilters<Income>({
  initialFilters: {
    date: {
      value: [new Date(0), new Date()],
      filter: () => true,
      excludeApplied: true
    },
    warehouse_name: {
      value: [],
      filter: (item: Income, filterVal: string[]) => {
        return filterVal.length === 0 || filterVal.includes(item.warehouse_name);
      }
    },
    barcode: {
      value: "",
      filter: (item: Income, filterVal: string) => {
        return !filterVal ||
            item.barcode.toLowerCase().trim().includes(filterVal.toLowerCase());
      }
    },
    supplier_article: {
      value: "",
      filter: (item: Income, filterVal: string) => {
        return !filterVal ||
            item.supplier_article.toLowerCase().trim().includes(filterVal.toLowerCase());
      }
    },
  },
  data: baseData
});


function onDataChange(data: Income[]) {
  baseData.value = data.map((item) => ({
    ...item,
    unique_id: `${item.nm_id}-${item.income_id}`
  }));

  filterData();
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

</script>