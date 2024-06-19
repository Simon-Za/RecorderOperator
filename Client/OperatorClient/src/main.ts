import './assets/main.css'

import { createApp } from 'vue'
import { type Pinia, createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { ImportExtensions } from './extensions'
import { ImportStores } from './stores'



import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});



export let pinia: Pinia = createPinia()

const app = createApp(App)




pinia = ImportExtensions(pinia)
pinia = ImportStores(pinia)

app.use(pinia)

app.use(router)
app.use(vuetify);
app.mount('#app')