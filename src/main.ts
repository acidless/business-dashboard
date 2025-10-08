import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createMemoryHistory, createRouter} from "vue-router";
import Incomes from "./components/Incomes.vue";
import Orders from "./components/Orders.vue";
import Sales from "./components/Sales.vue";
import Stocks from "./components/Stocks.vue";

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: '/', component: Incomes, alias: "/incomes" },
        { path: '/orders', component: Orders },
        { path: '/sales', component: Sales },
        { path: '/stocks', component: Stocks },
    ]
});

createApp(App).use(router).mount('#app')
