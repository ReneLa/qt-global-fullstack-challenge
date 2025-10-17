"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function NetworkStatus() {
  useEffect(() => {
    const handleOnline = () => {
      toast.success("Connection restored", {
        description: "You're back online"
      });
    };

    const handleOffline = () => {
      toast.error("Connection lost", {
        description: "Please check your internet connection",
        // duration: Infinity // Keep showing until online
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null;
}
