<template>
  <Dashboard endpoint="orders" :processed-data="processedData" @on-data-change="onDataChange"
             @on-filters-change="onFiltersChange" :filters="filters">
    <template #chart>
      <FieldChart v-if="processedData.length" label-field="date" data-field-title="Total Price" data-field="total_price"
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
      <Column field="barcode" header="Barcode" filterField="barcode" :filter="true" :showFilterMenu="false">
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
      <Column field="date" header="Date" filterField="date" :filter="true" :showFilterMenu="false">
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
      <Column field="brand" header="Brand" filterField="brand" :filter="true" :showFilterMenu="false">
        <template #body="{ data }">
          <span>{{ data.brand }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Brand"
              @input="filterCallback()"
              class="p-column-filter"
          />
        </template>
      </Column>
      <Column field="subject" header="Subject" filterField="subject" :filter="true" :showFilterMenu="false">
        <template #body="{ data }">
          <span>{{ data.subject }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Subject"
              @input="filterCallback()"
              class="p-column-filter"
          />
        </template>
      </Column>
      <Column field="subject" header="Subject">
        <template #body="{ data }">
          <span>{{ data.subject }}</span>
        </template>
      </Column>
      <Column field="discount_percent" header="Discount" body-style="text-align: center;"
              header-style="text-align: center;">
        <template #body="{ data }">
          <Tag v-if="data.discount_percent > 20" severity="success" :value="data.discount_percent"></Tag>
          <Tag v-else-if="data.discount_percent > 10" severity="warn" :value="data.discount_percent"></Tag>
          <Tag v-else severity="danger" :value="data.discount_percent"></Tag>
        </template>
      </Column>
      <Column field="is_cancel" header="Status" filterField="is_cancel" :filter="true"
              :showFilterMenu="false" body-style="text-align: center;"
              header-style="text-align: center; display: flex; justify-content: center;">
        <template #body="{ data }">
          <Tag v-if="data.is_cancel" severity="danger" value="CANCELED"></Tag>
          <Tag v-else severity="success" value="OK"></Tag>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
              v-model="filterModel.value"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select status"
              @change="filterCallback()"
              class="p-column-filter"
              :showClear="true"
          />
        </template>
      </Column>
    </template>
  </Dashboard>
</template>

<script setup lang="ts">
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import Message from 'primevue/message';
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import {ref} from "vue";
import {type Order} from "../types.ts";
import Dashboard from "./Dashboard.vue";
import FieldChart from "./FieldChart.vue";
import {useFilters} from "../hooks/useFilters.ts";

const statusOptions = [
  {label: 'OK', value: false},
  {label: 'CANCELED', value: true},
];

const baseData = ref<Order[]>([]);
const {filters, filtersApplied, clearFilter, filterData, onFiltersChange, processedData} = useFilters<Order>({
  initialFilters: {
    date: {
      value: [new Date(0), new Date()],
      filter: () => true,
      excludeApplied: true
    },
    barcode: {
      value: "",
      filter: (item: Order, filterVal: string) => {
        return !filterVal ||
            item.barcode.toLowerCase().trim().includes(filterVal.toLowerCase());
      }
    },
    brand: {
      value: "",
      filter: (item: Order, filterVal: string) => {
        return !filterVal ||
            item.brand.toLowerCase().trim().includes(filterVal.toLowerCase());
      }
    },
    subject: {
      value: "",
      filter: (item: Order, filterVal: string) => {
        return !filterVal ||
            item.subject.toLowerCase().trim().includes(filterVal.toLowerCase());
      }
    },
    is_cancel: {
      value: null as boolean | null,
      filter: (item: Order, filterVal: string) => {
        return filterVal === null || item.is_cancel === filterVal;
      }
    },
  },
  data: baseData
});

function onDataChange(data: Order[]) {
  baseData.value = data.map((item) => ({
    ...item,
    unique_id: `${item.g_number}-${item.barcode}`
  }));

  filterData();
}

</script>