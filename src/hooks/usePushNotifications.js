// src/hooks/usePushNotifications.js
import { useEffect, useState, useCallback } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, VAPID_KEY } from "../firebase-config";

// Reads your existing auth token from wherever you already store it after login.
// Adjust this one line to match your app (e.g. context, redux, cookie).
function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function usePushNotifications() {
  const [permissionState, setPermissionState] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [error, setError] = useState(null);

  const enablePush = useCallback(async () => {
    setError(null);
    try {
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        throw new Error("Push notifications are not supported in this browser");
      }

      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      if (permission !== "granted") {
        return;
      }

      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      const fcmToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!fcmToken) {
        throw new Error("Could not get FCM token");
      }

      // Send the token to the backend so it can push to this device later.
      await fetch("/api/users/fcm-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ token: fcmToken }),
      });
    } catch (err) {
      setError(err.message || "Failed to enable notifications");
    }
  }, []);

  // Foreground messages: tab is open, so show your existing SMS-style banner
  // instead of (or alongside) the native browser notification.
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      window.dispatchEvent(
        new CustomEvent("push-notification", { detail: { title, body } })
      );
    });
    return unsubscribe;
  }, []);

  return { permissionState, enablePush, error };
}
