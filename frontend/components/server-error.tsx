"use client";

import { ServerCrashIcon } from "lucide-react";

import { Spinner } from "@/components/ui";

interface ServerErrorProps {
  isChecking?: boolean;
}

export function ServerError({ isChecking = false }: ServerErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
            <ServerCrashIcon className="w-10 h-10 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Server Unavailable
            </h1>
            <p className="text-sm text-muted-foreground">
              We&apos;re having trouble connecting to the server. Please check
              that the backend is running.
            </p>
          </div>

          {isChecking && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              <span>Retrying connection...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
