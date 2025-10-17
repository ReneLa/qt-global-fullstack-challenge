import Link from "next/link";
import { HomeIcon } from "lucide-react";

import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted">
            <span className="text-4xl font-bold text-muted-foreground">
              404
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Page not found
            </h1>
            <p className="text-sm text-muted-foreground">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
          </div>

          <Button asChild>
            <Link href="/">
              <HomeIcon className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
