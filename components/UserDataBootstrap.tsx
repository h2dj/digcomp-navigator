"use client";

import { useEffect } from "react";
import { getHistory, getProfile } from "@/lib/scoring";
import { getOrCreateUserId, pushUserDataToServer, restoreUserDataFromServer } from "@/lib/user-sync";

export function UserDataBootstrap() {
  useEffect(() => {
    getOrCreateUserId();

    void (async () => {
      const restored = await restoreUserDataFromServer();
      if (restored) return;

      await pushUserDataToServer({
        profile: getProfile(),
        results: getHistory(),
      });
    })();
  }, []);

  return null;
}
