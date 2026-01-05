import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/tailwind.css'
import App from './App.vue'
import { useAppStore } from './stores'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const appStore = useAppStore()
appStore.loadSettings()

app.mount('#app')
