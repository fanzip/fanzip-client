/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyB2bwId50fvnuZ_vuq-F1SerhJ3zBxOu5A',
  authDomain: 'fanzip-6a8c8.firebaseapp.com',
  projectId: 'fanzip-6a8c8',
  storageBucket: 'fanzip-6a8c8.firebasestorage.app',
  messagingSenderId: '301381375917',
  appId: '1:301381375917:web:35da5fbba909f40ab5f324',
  measurementId: 'G-88Q2F5HKJK',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  try {
    // ✅ data-only 대비: data 우선 → notification 폴백
    const d = payload?.data || {}
    const n = payload?.notification || {}

    const title = d.title || n.title || '알림'
    const body = d.body || n.body || ''
    const rawUrl = d.targetUrl || payload?.fcmOptions?.link || '/'
    const url = new URL(rawUrl, self.location.origin).href

    self.registration.showNotification(title, {
      body,
      icon: '/logo.svg',
      badge: '/logo.svg',
      tag: 'fanzip-notification',
      data: { url },
      // requireInteraction: true, // (선택) 사용자가 클릭할 때까지 남기고 싶다면
    })
  } catch (err) {
    console.error('[FCM SW] onBackgroundMessage error:', err, payload)
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification?.data?.url || '/'
  event.waitUntil(
    (async () => {
      const target = new URL(url, self.location.origin).href
      const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const c of clientsList) {
        try {
          const current = new URL(c.url, self.location.origin).href
          if (c.focus) await c.focus()
          if (current !== target && 'navigate' in c) {
            try {
              await c.navigate(target)
            } catch {}
          }
          return
        } catch {}
      }
      if (clients.openWindow) return clients.openWindow(target)
    })(),
  )
})

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()))
