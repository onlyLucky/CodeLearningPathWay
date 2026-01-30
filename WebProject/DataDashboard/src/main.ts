import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { initRem } from './utils/rem'
import Message from './utils/message'
import './styles/rem.scss'

initRem()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 全局注册Message组件
app.config.globalProperties.$message = Message

app.mount('#app')
