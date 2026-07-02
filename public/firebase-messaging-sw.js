// public/firebase-messaging-sw.js
// This file MUST live in the public/ root (not src/) so it's served at
// https://yourdomain.com/firebase-messaging-sw.js — Firebase requires that exact path.

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Paste the same config object you got from Firebase Console > Project Settings > General.
// Service workers can't read Vite/CRA env variables, so these values are hardcoded here.
// They are PUBLIC keys (safe to expose client-side) — do not put the service account JSON here.
firebase.initializeApp({
  apiKey: "AIzaSyAAOb8zoRIb0L97wSjlxiE_U-oTcFYCIkk",
  authDomain: "telangana-special.firebaseapp.com",
  projectId: "telangana-special",
  storageBucket: "telangana-special.firebasestorage.app",
  messagingSenderId: "772599525202",
  appId: "1:772599525202:web:d14ce4ca4a139c8385d48b",
});


const messaging = firebase.messaging();

// Fires when a push arrives while the tab is closed or in the background.
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Telangana Special', {
    body: body || '',
    icon: '/icon-192x192.png',   // reuse your existing app icon, or add one at this path
    badge: '/badge-72x72.png',   // optional small monochrome icon; safe to omit if you don't have one
    data: payload.data || {},
  });
});

// Optional: clicking the notification focuses/opens the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
