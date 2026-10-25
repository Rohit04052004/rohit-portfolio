"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const interval = setInterval(callback, 1000 * 30);
  return () => clearInterval(interval);
}

function getSnapshot() {
  return new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getServerSnapshot() {
  return "";
}

export default function Clock() {
  const formatted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <span className="inline-block w-36 text-right">{formatted}</span>;
}
