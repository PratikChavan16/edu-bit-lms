"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@bitflow/ui/cn";
import { Button } from "@bitflow/ui/button";
import { Separator } from "@bitflow/ui/separator";
import { Badge } from "@bitflow/ui/badge";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/library", label: "Library" },
  { href: "/documents", label: "Documents" },
  { href: "/results", label: "Results" },
  { href: "/help", label: "Help" },
];

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-lg bg-primary/10 text-center text-lg font-semibold leading-9 text-primary">B</span>
              <div>
                <p className="text-sm font-semibold">Bitflow Nova</p>
                <p className="text-xs text-muted-foreground">MVP Engineering College</p>
              </div>
            </Link>
            <Badge variant="secondary" className="hidden md:inline-flex">
              Academic Year 2025-26
            </Badge>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Notifications
            </Button>
            <Button size="sm">ID Card</Button>
          </div>
        </div>
        <Separator className="md:hidden" />
        <nav className="flex items-center gap-3 overflow-x-auto px-4 pb-3 pt-2 md:hidden">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium",
                pathname === item.href ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
      </main>
      <footer className="border-t border-border bg-surface/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Powered by Bitflow Nova</p>
          <div className="flex gap-4">
            <Link href="/help">Support</Link>
            <Link href="/documents">Documents</Link>
            <Link href="/settings">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
