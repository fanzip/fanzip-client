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


// SW 등록 → 준비 대기 → (로그인 상태면) FCM 초기화
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({ immediate: true })

    // vite-plugin-pwa가 등록한 SW가 활성화되길 기다림
    const registration = await navigator.serviceWorker.ready

    // 로그인되어 있으면 FCM 토큰 등록
    if (localStorage.getItem('access-token')) {
      // initFcm에서 serviceWorkerRegistration을 사용하도록!
      initFcm(registration).catch(console.error)
    }
  })
}