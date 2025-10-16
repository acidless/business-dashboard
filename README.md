# 📊 Business Analytics Dashboard

SPA for visualizing data via API: **incomes**, **orders**, **sales**, and **stocks**.
The project was developed using **Vue 3 + Composition API** with the **PrimeVue** UI library.

## 🚀 Features

- 4 pages corresponding to API endpoints:
  - **/incomes** — income
  - **/orders** — orders
  - **/sales** — sales
  - **/stocks** — warehouses
- On each page:
  - 📈 chart for one of the key fields;
  - 🧾 table with data;
  - 🔍 client filters by fields;
  - 📄 server pagination (`limit`, `offset`);
 
![Vue](https://img.shields.io/badge/-Vue.js-35495E?logo=vuedotjs&logoColor=4FC08D&style=for-the-badge)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)

## 📷 Demo

![UI](./assets/screenshot.png)

Try dashboard online:  
[![Open demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-blue?style=for-the-badge)](https://business-dashboard-one-eta.vercel.app)

## 🛠️ Технологии

| Category | Used |
|------------|---------------|
| Framework | [Vue 3](https://vuejs.org/) с [Composition API](https://vuejs.org/api/composition-api-setup.html) |
| UI-components | [PrimeVue](https://primevue.org/) |
| Charts | [Chart.js](https://www.chartjs.org/) with PrimeVue Chart |
| Bundler | [Vite](https://vitejs.dev/) |
| Types | [TypeScript](https://www.typescriptlang.org/) |
| Deployment | [Vercel](https://vercel.com/) |
| Code formatting | ESLint + Prettier |

---

## ⚙️ Install

```bash
git clone https://github.com/acidless/business-dashboard.git
cd business-dashboard
npm install
npm run dev

# Make production build
npm run build
```

