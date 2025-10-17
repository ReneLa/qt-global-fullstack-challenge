import type { Metadata } from "next";
import "./globals.css";

import { ibmPlexSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";

import { Header } from "@/components/header";
import { ErrorBoundary } from "@/components/error-boundary";
import { NetworkStatus } from "@/components/network-status";
import { ClientProvider } from "@/components/providers/api-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ServerHealthProvider } from "@/components/providers/server-health-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(ibmPlexSans.className, "antialiased")}>
        <ErrorBoundary>
          <ClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ServerHealthProvider>
                <NetworkStatus />
                <Header />
                <ModalProvider />
                {children}
                <Toaster richColors />
              </ServerHealthProvider>
            </ThemeProvider>
          </ClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
