import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// fanzip 프로젝트 Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyB2bwId50fvnuZ_vuq-F1SerhJ3zBxOu5A",
  authDomain: "fanzip-6a8c8.firebaseapp.com",
  projectId: "fanzip-6a8c8",
  storageBucket: "fanzip-6a8c8.firebasestorage.app",
  messagingSenderId: "301381375917",
  appId: "1:301381375917:web:35da5fbba909f40ab5f324",
  measurementId: "G-88Q2F5HKJK"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Messaging 인스턴스
export const messaging = getMessaging(app);

// 토큰 요청 함수
export async function requestFcmToken(vapidKey, swReg) {
  try {
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swReg
    });
    return token;
  } catch (err) {
    console.error("FCM 토큰 가져오기 실패:", err);
    return null;
  }
}

// 포그라운드 메시지 리스너
export function bindForegroundMessage(handler) {
  onMessage(messaging, handler);
}
