import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@bitflow/ui/theme-provider";
import { QueryProvider } from "./providers";
import { SiteShell } from "../components/site-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitflow Nova Learner",
  description: "Student and parent experience for Bitflow Nova",
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
            <SiteShell>{children}</SiteShell>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
