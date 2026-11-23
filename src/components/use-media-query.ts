"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
export const compactSceneQuery = "(max-width: 650px)";

function serverSnapshot() {
  return false;
}

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (update: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}

function isAndroidBrowser() {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

export function useSiteReducedMotion() {
  const reduced = useMediaQuery(reducedMotionQuery);
  return reduced && !isAndroidBrowser();
}

export function MotionPlatform() {
  useEffect(() => {
    if (!isAndroidBrowser()) return;
    const root = document.documentElement;
    root.dataset.motionPlatform = "android";
    return () => {
      delete root.dataset.motionPlatform;
    };
  }, []);
  return null;
}
