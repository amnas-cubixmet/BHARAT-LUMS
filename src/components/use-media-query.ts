"use client";

import { useCallback, useSyncExternalStore } from "react";

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

export function useSiteReducedMotion() {
  return useMediaQuery(reducedMotionQuery);
}
