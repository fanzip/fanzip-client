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

// 백그라운드 메시지 수신 시 처리
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM SW] 백그라운드 메시지 수신:', payload)
  
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.svg',
    badge: '/logo.svg',
    data: {
      url: payload.fcmOptions?.link || payload.data?.targetUrl || '/'
    }
  }

  // Service Worker에서 알림 표시 (백그라운드에서만)
  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// 알림 클릭 시 처리
self.addEventListener('notificationclick', (event) => {
  console.log('[FCM SW] 알림 클릭:', event)
  event.notification.close()
  
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 이미 열린 창이 있으면 포커스
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // 새 창 열기
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()))
