<template>
  <Dashboard endpoint="sales" :processed-data="processedData" @on-data-change="onDataChange"
             @on-filters-change="onFiltersChange" :filters="filters">
    <template #chart>
      <FieldChart v-if="processedData.length" label-field="date" data-field-title="For Pay" data-field="for_pay"
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
      <Column field="supplier_article" header="Article" filterField="supplier_article" :filter="true"
              :showFilterMenu="false">
        <template #body="{ data }">
          {{ data.supplier_article }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Supplier article"
              @input="filterCallback()"
              class="p-column-filter"
          />
        </template>
      </Column>
      <Column field="total_price" header="Total Price">
        <template #body="{ data }">
          {{ Math.round(data.total_price * 100) / 100 }}
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
      <Column field="for_pay" header="For Pay">
        <template #body="{ data }">
          {{ Math.round(data.for_pay * 100) / 100 }}
        </template>
      </Column>
      <Column
          header="Warehouse Name"
          field="warehouse_name"
          filterField="warehouse_name"
          :filter="true"
          :showFilterMenu="false"
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
import {ref} from "vue";
import {type Sale} from "../types.ts";
import Dashboard from "./Dashboard.vue";
import FieldChart from "./FieldChart.vue";
import {useFilters} from "../hooks/useFilters.ts";
import Tag from "primevue/tag";
import useWarehouseOptions from "../hooks/useWarehouseOptions.ts";

const baseData = ref<Sale[]>([]);
const {filters, filtersApplied, clearFilter, filterData, onFiltersChange, processedData} = useFilters<Sale>({
  initialFilters: {
    date: {
      value: [new Date(0), new Date()],
      filter: () => true,
      excludeApplied: true
    },
    warehouse_name: {
      value: [],
      filter: (item: Sale, filterVal: string[]) => {
        return filterVal.length === 0 || filterVal.includes(item.warehouse_name);
      }
    },
    supplier_article: {
      value: "",
      filter: (item: Sale, filterVal: string) => {
        return !filterVal ||
            item.supplier_article.toLowerCase().trim().includes(filterVal.toLowerCase());
      }
    },
  },
  data: baseData
});


function onDataChange(data: Sale[]) {
  baseData.value = data.map((item) => ({
    ...item,
    unique_id: `${item.g_number}-${item.barcode}`
  }));

  filterData();
}

const warehouseOptions = useWarehouseOptions(baseData);

</script>