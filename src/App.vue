<script setup lang="ts">
import {Menubar} from "primevue";
import { useRoute } from "vue-router";

const route = useRoute();

const items = [
  { label: "Incomes", icon: "pi pi-inbox", path: "/incomes" },
  { label: "Orders", icon: "pi pi-shopping-cart", path: "/orders" },
  { label: "Sales", icon: "pi pi-chart-line", path: "/sales" },
  { label: "Stocks", icon: "pi pi-box", path: "/stocks" }
];

const isActive = (path: string) => (path === "/incomes" && route.path === "/") || route.path === path;
</script>

<template>
  <Menubar class="sticky top-2 z-100" :model="items">
    <template #item="{ item }">
      <RouterLink
          :to="item.path"
          class="menu-link flex items-center"
          :class="{ 'active-link': isActive(item.path) }">
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </RouterLink>
    </template>
  </Menubar>

  <main class="col-span-10">
    <RouterView />
  </main>
</template>
<style lang="css" scoped>
.menu-link {
  color: #ffffff;
  padding: 0.5rem;
}

.menu-link.active-link {
  background: var(--p-navigation-item-focus-background);
  border-radius: var(--p-menubar-base-item-border-radius);
}

.menu-link i {
  margin-right: 0.25rem;
}

</style>
