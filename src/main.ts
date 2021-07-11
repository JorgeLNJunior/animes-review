import 'bulma'
import 'vue-toastification/dist/index.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import vueDebounce, { PluginConfig } from 'vue-debounce'
import Toast, { PluginOptions } from 'vue-toastification'

import App from './App.vue'
import { router } from './routes'

createApp(App)
  .use(router)
  .use(createPinia())
  .use(Toast, { maxToasts: 3, timeout: 3000 } as PluginOptions)
  .use(vueDebounce, { listenTo: 'input' } as PluginConfig)
  .mount('#app')
