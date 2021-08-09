import 'bulma'
import 'bulma-calendar/dist/css/bulma-calendar.min.css'
import 'bulma-calendar/dist/js/bulma-calendar.min.js'
import 'vue-toastification/dist/index.css'
import '@creativebulma/bulma-divider/dist/bulma-divider.min.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import vueDebounce, { PluginConfig } from 'vue-debounce'
import Toast, { PluginOptions } from 'vue-toastification'

import App from './App.vue'
import { router } from './routes'

createApp(App)
  .use(router)
  .use(createPinia())
  .use(Toast, { maxToasts: 3, timeout: 4000 } as PluginOptions)
  .use(vueDebounce, { listenTo: 'input' } as PluginConfig)
  .mount('#app')
