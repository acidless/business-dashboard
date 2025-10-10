<template>
  <div class="mt-4">
    <Chart type="line" :data="chartData" :options="chartOptions" style="height: 300px;" />
  </div>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';
import {ref, watchEffect} from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  dataField: {
    type: String,
    required: true
  },
  dataFieldTitle: {
    type: String,
    required: true
  },
  labelField: {
    type: String,
    required: true
  }
});

const chartData = ref()
const chartOptions = ref()

watchEffect(() => {
  if (!props.data.length) {
    return;
  }

  const labels = props.data.map((item: any) => item[props.labelField]);
  const data = props.data.map((item: any) => item[props.dataField]);

  chartData.value = {
    labels,
    datasets: [
      {
        label: props.dataFieldTitle,
        data,
        fill: false,
        borderColor: '#34d399',
        tension: 0.3
      }
    ]
  };

  chartOptions.value = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: {
            size: 16
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {color: '#ababab'},
        grid: {color: '#f3f4f6'}
      },
      y: {
        ticks: {color: '#ababab'},
        grid: {color: '#f3f4f6'}
      }
    }
  }
});

</script>