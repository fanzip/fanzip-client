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

firebase.messaging()

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()))
