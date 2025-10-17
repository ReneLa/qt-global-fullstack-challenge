"use client";

import { useServerHealth } from "@/hooks";
import { ServerError } from "@/components/server-error";

export function ServerHealthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { isServerAvailable, isChecking } = useServerHealth();

  // Show loading/checking state briefly on initial load
  if (isServerAvailable === null && isChecking) {
    return null; // or a loading spinner if you prefer
  }

  // Show error page if server is down
  if (isServerAvailable === false) {
    return <ServerError isChecking={isChecking} />;
  }

  // Server is available, render children
  return <>{children}</>;
}
