"use client";

import { redirectToSignIn } from "@/lib/apiClient";
import { NOTIFICATION_KIND_LABELS } from "@/lib/constants/notifications";
import type { StaffNotification } from "@/lib/types/notification";

export type { StaffNotification };
export type RequestListener = (requests: StaffNotification[]) => void;
export type ConnectionListener = (connected: boolean) => void;

const requestListeners = new Set<RequestListener>();
const connectionListeners = new Set<ConnectionListener>();
let eventSource: EventSource | null = null;
let subscriberCount = 0;
let isConnectedGlobal = false;

function notifyBrowser(requests: StaffNotification[]) {
  if (!("Notification" in window) || Notification.permission !== "granted")
    return;
  requests.forEach((r) => {
    const title = NOTIFICATION_KIND_LABELS[r.kind] ?? "New laundry request";
    new Notification(title, {
      body: `Room ${r.roomNumber}${r.guestName ? "- " + r.guestName : ""}${r.isExpress ? " · Express" : ""}`,
      icon: "/favicon.ico",
    });
  });
}

function handleIncoming(e: Event) {
  const requests: StaffNotification[] = JSON.parse((e as MessageEvent).data);
  requestListeners.forEach((cb) => cb(requests));
  notifyBrowser(requests);
}

// One EventSource shared by every subscriber- separate connections to the
// same endpoint were racing each other and silently dropping events.
function connect() {
  if (eventSource) return;
  eventSource = new EventSource("/api/staff/notifications/stream");
  const setConnected = (v: boolean) => {
    isConnectedGlobal = v;
    connectionListeners.forEach((cb) => cb(v));
  };
  eventSource.addEventListener("connected", () => setConnected(true));
  eventSource.addEventListener("new_requests", handleIncoming);
  eventSource.addEventListener("assigned_to_you", handleIncoming);
  eventSource.onerror = () => {
    setConnected(false);
    // A dropped connection retries itself; a refused one does not. Per the
    // EventSource spec any non-200- proxy.ts's 401 once the session lapses-
    // closes the stream for good, so that is the signal to sign in again.
    if (eventSource?.readyState === EventSource.CLOSED) {
      disconnect();
      redirectToSignIn();
    }
  };
}

function disconnect() {
  eventSource?.close();
  eventSource = null;
  isConnectedGlobal = false;
}

export function subscribe(
  onRequests: RequestListener,
  onConnection: ConnectionListener,
) {
  subscriberCount += 1;
  connect();
  requestListeners.add(onRequests);
  connectionListeners.add(onConnection);

  return () => {
    requestListeners.delete(onRequests);
    connectionListeners.delete(onConnection);
    subscriberCount -= 1;
    if (subscriberCount <= 0) disconnect();
  };
}

export function getIsConnected() {
  return isConnectedGlobal;
}
