// src/main.js
import './styles/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initFcm } from '@/fcm-init'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    // ① PWA(sw.js): vite-plugin-pwa가 루트 스코프('/')에 등록
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({ immediate: true })

    // ② FCM 전용 SW: 별도 스코프('/firebase/')로 명시 등록
    const fcmReg = await navigator.serviceWorker.register(
      '/firebase/firebase-messaging-sw.js',
      { scope: '/firebase/' }
    )

    // ③ 로그인 상태면 FCM 초기화 (전용 registration을 객체로 전달)
    if (localStorage.getItem('access-token')) {
      await initFcm({ registration: fcmReg })
    }
  })
}
