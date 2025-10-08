<script setup lang="ts">
</script>

<template>
  <nav>
    <RouterLink to="/incomes">Incomes</RouterLink>
    <RouterLink to="/orders">Orders</RouterLink>
    <RouterLink to="/sales">Sales</RouterLink>
    <RouterLink to="/stocks">Stocks</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>