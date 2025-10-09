import { createApp } from 'vue'
import './style.css'
import 'primeicons/primeicons.css';
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import Incomes from "./components/Incomes.vue";
import Orders from "./components/Orders.vue";
import Sales from "./components/Sales.vue";
import Stocks from "./components/Stocks.vue";
import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Incomes, alias: "/incomes" },
        { path: '/orders', component: Orders },
        { path: '/sales', component: Sales },
        { path: '/stocks', component: Stocks },
    ]
});

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});


app.mount('#app');
