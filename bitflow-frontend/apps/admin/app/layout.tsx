import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@bitflow/ui/theme-provider";
import { ToastContainer } from "@bitflow/ui/toast";
import { QueryProvider } from "./providers";
import { AuthGuard } from "../components/auth-guard";
import { AppShell } from "../components/app-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitflow Nova",
  description: "Central Operations & Management Portal",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full bg-surface text-foreground ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthGuard>
              <AppShell>{children}</AppShell>
            </AuthGuard>
          </QueryProvider>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
