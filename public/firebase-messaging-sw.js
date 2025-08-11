/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: '...',
  authDomain: 'fanzip-6a8c8.firebaseapp.com',
  projectId: 'fanzip-6a8c8',
  storageBucket: 'fanzip-6a8c8.firebasestorage.app',
  messagingSenderId: '301381375917',
  appId: '1:301381375917:web:35da5fbba909f40ab5f324',
})

const messaging = firebase.messaging()

// 백그라운드/종료 상태에서 수신 시, 우리가 직접 노티 표시 + url 저장
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || '알림'
  const body  = payload.notification?.body  || ''
  const icon  = payload.notification?.image
  const url   = payload.fcmOptions?.link || payload.data?.targetUrl || 'http://localhost:5173'

  self.registration.showNotification(title, {
    body,
    icon,
    data: { url }, // 우리가 넣은 안전한 위치
  })
})

// 클릭 시 이동 (data.url 사용)
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification?.data?.url || 'http://localhost:5173'
  event.waitUntil(clients.openWindow(url))
})
