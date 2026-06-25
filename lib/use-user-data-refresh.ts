"use client";

import { useEffect } from "react";
import { USER_DATA_RESTORED_EVENT } from "@/lib/user-sync";

export function useUserDataRefresh(refresh: () => void) {
  useEffect(() => {
    refresh();
    window.addEventListener(USER_DATA_RESTORED_EVENT, refresh);
    return () => window.removeEventListener(USER_DATA_RESTORED_EVENT, refresh);
  }, [refresh]);
}
