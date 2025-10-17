"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export function useServerHealth() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["server-health"],
    queryFn: () => api.healthCheck(),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    refetchInterval: (query) => {
      // If server is down, retry every 10 seconds
      return query.state.status === "error" ? 10000 : false;
    },
    refetchOnWindowFocus: true,
    staleTime: 30000 // Consider health status stale after 30 seconds
  });

  return {
    isServerAvailable: isError ? false : data ? true : null,
    isChecking: isLoading
  };
}
