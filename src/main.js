// src/main.js
import './styles/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initFcm } from '@/fcm-init'   // ✅ 추가: FCM 초기화 함수


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// ✅ 추가: 로그인돼 있으면 자동 FCM 등록 (메인 로직은 건드리지 않음)
if ('serviceWorker' in navigator && localStorage.getItem('access-token')) {
  initFcm().catch(console.error)
}
