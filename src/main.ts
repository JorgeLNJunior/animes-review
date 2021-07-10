import 'bulma'
import 'vue-toastification/dist/index.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Toast, { PluginOptions } from 'vue-toastification'

import App from './App.vue'
import { router } from './routes'

const toastOptions: PluginOptions = {
  maxToasts: 3
}

createApp(App).use(router).use(Toast, toastOptions).use(createPinia()).mount('#app')
