/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import ResponsiveMixin from "./mixins/responsiveMixins";


// Composables
import { createApp } from 'vue'

const app = createApp(App)

app.mixin(ResponsiveMixin);

registerPlugins(app)

app.mount('#app')
