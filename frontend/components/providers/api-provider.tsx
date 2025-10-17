"use client";

import {
  QueryClient,
  QueryClientProvider,
  isServer
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { toast } from "sonner";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          // Don't retry on network errors
          if (error instanceof Error && error.message.includes("fetch")) {
            return false;
          }
          return failureCount < 2;
        }
      },
      mutations: {
        onError: (error) => {
          // Show toast for network errors
          if (error instanceof Error) {
            if (!navigator.onLine) {
              toast.error("No internet connection", {
                description: "Please check your network and try again"
              });
            } else {
              toast.error("Something went wrong", {
                description: error.message
              });
            }
          }
        }
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function ClientProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
