import './styles/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 개발환경에서만 테스트 도구 로드 (프로덕션에서는 불필요)
if (import.meta.env.DEV) {
  import('./utils/testHelper.js')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
