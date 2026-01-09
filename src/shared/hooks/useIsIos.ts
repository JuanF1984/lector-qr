import { useMemo } from "react";

export function useIsIos() {
  return useMemo(() => {
    const ua = window.navigator.userAgent || "";
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    return isIOS;
  }, []);
}
