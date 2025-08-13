// src/fcm-init.js
import { requestFcmToken, bindForegroundMessage } from '@/firebase'

let booted = false
let messageHandlerBound = false
const LAST_KEY = 'last_sent_fcm_token'

/**
 * 로그인 성공 직후 또는 앱 부팅 시(이미 access-token 있으면) 호출
 *   - 성공시만 last_sent_fcm_token 저장
 *   - 실패/스킵 사유 콘솔 출력
 */
export async function initFcm({ force = false } = {}) {
  if (booted && !force) return
  if (!('serviceWorker' in navigator)) {
    console.warn('[FCM] serviceWorker not supported'); return
  }

  const access = localStorage.getItem('access-token')
  if (!access) { console.warn('[FCM] no access-token, skip'); return }

  try {
    // 1) 서비스워커 등록
    const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    console.log('[FCM] SW registered:', swReg.scope)

    // 2) 권한 요청
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') { console.warn('[FCM] permission denied'); return }

    // 3) 토큰 발급
    const vapid = import.meta.env.VITE_FIREBASE_VAPID_KEY
    if (!vapid) { console.error('[FCM] VITE_FIREBASE_VAPID_KEY missing'); return }

    const token = await requestFcmToken(vapid, swReg)
    console.log('[FCM] token:', token)
    if (!token) { console.warn('[FCM] no token retrieved'); return }

    // 4) 서버에 등록 (성공 시에만 last_sent 저장)
    const base = import.meta.env.VITE_API_BASE_URL
    if (!base) { console.error('[FCM] VITE_API_BASE_URL missing'); return }

    if (force || localStorage.getItem(LAST_KEY) !== token) {
      const qs = new URLSearchParams({ token, deviceType: 'WEB' }).toString()
      const res = await fetch(`${base}/api/notifications/token?${qs}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${access}` },
      })
      console.log('[FCM] register status:', res.status)

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`register failed ${res.status} ${text}`)
      }
      localStorage.setItem(LAST_KEY, token)
    }

    // 5) 포그라운드 알림 핸들링 (중복 방지 + 쓰로틀링)
    if (!messageHandlerBound) {
      let lastNotificationTime = 0
      const NOTIFICATION_THROTTLE = 2000 // 2초 내 중복 알림 방지
      
      bindForegroundMessage((payload) => {
        console.log('[FCM] 포그라운드 메시지 수신:', payload)
        
        const now = Date.now()
        if (now - lastNotificationTime < NOTIFICATION_THROTTLE) {
          console.log('[FCM] 중복 알림 방지 - 무시됨')
          return
        }
        
        const title = payload.notification?.title || '알림'
        const body = payload.notification?.body || ''
        const url = payload.fcmOptions?.link || payload.data?.targetUrl || '/'
        
        console.log('[FCM] 포그라운드 알림 표시:', title)
        lastNotificationTime = now
        
        // 포그라운드에서만 알림 표시
        if (Notification.permission === 'granted') {
          const notification = new Notification(title, { 
            body,
            icon: '/logo.svg',
            badge: '/logo.svg',
            tag: 'fanzip-notification' // 동일한 tag로 중복 방지
          })
          notification.onclick = () => {
            window.focus()
            if (url && url !== '/') {
              window.location.href = url
            }
            notification.close()
          }
        }
      })
      messageHandlerBound = true
      console.log('[FCM] 포그라운드 메시지 핸들러 등록 완료 (중복 방지 적용)')
    }

    booted = true
  } catch (e) {
    console.error('[FCM] init error:', e)
  }
}

/** 테스트/재전송용: 마지막 전송 토큰 리셋 */
export function resetLastSentFcmToken() {
  localStorage.removeItem(LAST_KEY)
}
