<template>
  <Dashboard endpoint="stocks" :processed-data="processedData" @on-data-change="onDataChange"
             @on-filters-change="onFiltersChange" :filters="filters">
    <template #chart>
      <FieldChart type="bar" v-if="processedData.length" label-field="warehouse" data-field-title="Quantity"
                  data-field="quantity"
                  :data="chartData"/>
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
      <Column header="Warehouse Name" field="warehouse_name" filterField="warehouse_name" :filter="true"
              :showFilterMenu="false">
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
      <Column field="quantity_full" header="Quantity">
        <template #body="{ data }">
          {{ data.quantity_full }}
        </template>
      </Column>
      <Column field="in_way_to_client" header="In Transit">
        <template #body="{ data }">
          → {{ data.in_way_to_client }} / ← {{ data.in_way_from_client }}
        </template>
      </Column>
      <Column field="price" header="Price">
        <template #body="{ data }">
          {{ Math.round(+data.price * 100) / 100 }}
        </template>
      </Column>
      <Column field="brand" header="Brand" filterField="brand" :filter="true" :showFilterMenu="false">
        <template #body="{ data }">
          {{ data.brand }}
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
    </template>
  </Dashboard>
</template>

<script setup lang="ts">
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import {computed, ref} from "vue";
import {type Stock} from "../types.ts";
import Dashboard from "./Dashboard.vue";
import FieldChart from "./FieldChart.vue";
import {useFilters} from "../hooks/useFilters.ts";
import useWarehouseOptions from "../hooks/useWarehouseOptions.ts";

const baseData = ref<Stock[]>([]);
const {filters, filtersApplied, clearFilter, filterData, onFiltersChange, processedData} = useFilters<Stock>({
  initialFilters: {
    date: {
      value: [new Date(), new Date()],
      filter: () => true,
      excludeApplied: true
    },
    warehouse_name: {
      value: [],
      filter: (item: Stock, filterVal: string[]) => {
        return filterVal.length === 0 || filterVal.includes(item.warehouse_name);
      }
    },
    supplier_article: {
      value: "",
      filter: (item: Stock, filterVal: string) => {
        return !filterVal ||
            item.supplier_article.toLowerCase().trim().includes(filterVal.toLowerCase());
      }
    },
    brand: {
      value: "",
      filter: (item: Stock, filterVal: string) => {
        return !filterVal ||
            item.brand.toLowerCase().trim().includes(filterVal.toLowerCase());
      }
    },
  },
  data: baseData
});

const chartData = computed(() => {
  const warehouseToQuantity = processedData.value.reduce((acc, item) => {
    acc[item.warehouse_name] = (acc[item.warehouse_name] || 0) + item.in_way_from_client - item.in_way_to_client;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(warehouseToQuantity).map(([warehouse, quantity]) => ({
    warehouse,
    quantity
  }));
});


function onDataChange(data: Stock[]) {
  baseData.value = data.map((item) => ({
    ...item,
    unique_id: JSON.stringify(item)
  }));

  filterData();
}

const warehouseOptions = useWarehouseOptions(baseData);

</script>