"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@bitflow/ui/cn";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Separator } from "@bitflow/ui/separator";

const sections = [
  {
    title: "Operations",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/universities", label: "Universities" },
      { href: "/feature-toggles", label: "Feature toggles", badge: "Live" },
      { href: "/change-requests", label: "Change requests" },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/billing", label: "Billing" },
      { href: "/invoices", label: "Invoices" },
    ],
  },
  {
    title: "Governance",
    items: [
      { href: "/audit-log", label: "Audit log" },
      { href: "/backups", label: "Backups" },
    ],
  },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
        <div className="flex items-center justify-between gap-3 px-6 py-5">
          <div>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Bitflow Nova</span>
            <p className="text-lg font-semibold">Central Operations</p>
          </div>
          <Badge variant="outline">v0.1</Badge>
        </div>
        <Separator />
        <nav className="flex-1 space-y-8 px-6 py-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <span>{item.label}</span>
                        {item.badge ? <Badge variant="secondary">{item.badge}</Badge> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="px-6 pb-6">
          <Button className="w-full" variant="secondary">
            Switch tenant
          </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface/95 px-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Today</p>
            <p className="text-lg font-semibold">Tuesday, 7 October 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">Support</Button>
            <Button>Provision university</Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
