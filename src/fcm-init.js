// src/fcm-init.js
import { requestFcmToken, bindForegroundMessage } from '@/firebase'

let booted = false
let messageHandlerBound = false
const LAST_KEY = 'last_sent_fcm_token'

export async function initFcm({ force = false, registration: registrationArg } = {}) {
  try {
    if (booted && !force) return
    if (!('serviceWorker' in navigator)) {
      console.warn('[FCM] serviceWorker not supported'); return
    }

    const access = localStorage.getItem('access-token')
    if (!access) { console.warn('[FCM] no access-token, skip'); return }

    // 1) SW registration 확보
    const registration =
      registrationArg || (await navigator.serviceWorker.ready)
    if (!registration?.active) {
      console.warn('[FCM] SW not active yet, skip'); return
    }
    console.log('[FCM] using SW:', registration.scope)

    // 2) 권한
    let perm = Notification.permission
    if (perm === 'default') perm = await Notification.requestPermission()
    if (perm !== 'granted') { console.warn('[FCM] permission not granted'); return }

    // 3) 토큰 발급 (SW와 묶어서)
    const vapid = import.meta.env.VITE_FIREBASE_VAPID_KEY
    if (!vapid) { console.error('[FCM] VITE_FIREBASE_VAPID_KEY missing'); return }

    const token = await requestFcmToken(vapid, registration)
    console.log('[FCM] token:', token)
    if (!token) { console.warn('[FCM] no token retrieved'); return }

    // 4) 서버 업서트
    const base = import.meta.env.VITE_API_BASE_URL
    if (!base) { console.error('[FCM] VITE_API_BASE_URL missing'); return }

    if (force || localStorage.getItem(LAST_KEY) !== token) {
      const qs = new URLSearchParams({ token, deviceType: 'WEB' }).toString()
      const ac = new AbortController()
      const t = setTimeout(() => ac.abort(), 7000)

      console.log('[FCM] 서버 요청 시작:', `${base}/api/notifications/token?${qs}`)

      try {
        const res = await fetch(`${base}/api/notifications/token?${qs}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${access}` },
          signal: ac.signal
        })
        clearTimeout(t)

        console.log('[FCM] 서버 응답 상태:', res.status)
        console.log('[FCM] 서버 응답 헤더:', [...res.headers.entries()])

        if (!res.ok) {
          const errorText = await res.text().catch(() => '응답 텍스트 읽기 실패')
          console.error('[FCM] 서버 에러 응답:', errorText)
          throw new Error(`register failed ${res.status} ${errorText}`)
        }

        const responseText = await res.text().catch(() => '')
        console.log('[FCM] 서버 성공 응답:', responseText)

        localStorage.setItem(LAST_KEY, token)
        console.log('[FCM] 토큰 localStorage에 저장 완료')

      } catch (e) {
        console.error('[FCM] 서버 요청 중 에러:', e)
        if (e.name === 'AbortError') {
          throw new Error('register timeout')
        }
        throw e
      }
    }

    // 5) 포그라운드 알림 핸들링
    if (!messageHandlerBound) {
      let lastNotificationTime = 0
      const NOTIFICATION_THROTTLE = 2000

      bindForegroundMessage((payload) => {
        const d = payload?.data || {}
        const n = payload?.notification || {}

        const now = Date.now()
        if (now - lastNotificationTime < NOTIFICATION_THROTTLE) {
          console.log('[FCM] throttled notification')
          return
        }
        lastNotificationTime = now

        const title = d.title || n.title || '알림'
        const body  = d.body  || n.body  || ''
        const rawUrl = d.targetUrl || payload?.fcmOptions?.link || '/'
        // 절대 URL 정규화
        const url = new URL(rawUrl, window.location.origin).href

        if (document.visibilityState === 'visible' && Notification.permission === 'granted') {
          const nobj = new Notification(title, {
            body,
            icon: '/logo.svg',
            badge: '/logo.svg',
            tag: 'fanzip-notification',
            data: { url }
          })
          nobj.onclick = () => {
            window.focus()
            if (url && url !== window.location.href) window.location.href = url
            nobj.close()
          }
        } else {
          console.log('[FCM] page hidden or permission not granted; skip foreground Notification')
        }
      })
      messageHandlerBound = true
      console.log('[FCM] foreground message handler bound')
    }

    booted = true
  } catch (e) {
    console.error('[FCM] init error:', e)
  }
}

export function resetLastSentFcmToken() {
  localStorage.removeItem(LAST_KEY)
}
