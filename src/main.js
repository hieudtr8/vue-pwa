import { createApp } from "vue";
import App from "./App.vue";
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import './registerServiceWorker'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

createApp().config.productionTip = false

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
})

createApp(App).use(vuetify).mount("#app");
