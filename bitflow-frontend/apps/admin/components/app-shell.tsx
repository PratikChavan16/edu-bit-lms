"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { cn, Badge, Button } from "@bitflow/ui";
import { Separator } from "@bitflow/ui";
import { Menu, X } from "lucide-react";

const sections = [
  {
    title: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Academic Management",
    items: [
      { href: "/universities", label: "Universities" },
      { href: "/colleges", label: "Colleges" },
      { href: "/departments", label: "Departments" },
      { href: "/courses", label: "Courses" },
      { href: "/subjects", label: "Subjects" },
      { href: "/batches", label: "Batches" },
    ],
  },
  {
    title: "People Management",
    items: [
      { href: "/students", label: "Students" },
      { href: "/faculty", label: "Faculty" },
    ],
  },
  {
    title: "Assessments",
    items: [
      { href: "/exams", label: "Exams" },
      { href: "/attendance", label: "Attendance" },
      { href: "/timetable", label: "Timetable" },
      { href: "/results", label: "Results & Grades" },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/fees", label: "Fees & Payments" },
      { href: "/billing", label: "Billing" },
      { href: "/invoices", label: "Invoices" },
    ],
  },
  {
    title: "Communication",
    items: [
      { href: "/announcements", label: "Announcements" },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/feature-toggles", label: "Feature toggles", badge: "Live" },
      { href: "/change-requests", label: "Change requests" },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-border bg-surface transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-4 top-4 rounded-md p-2 hover:bg-muted lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
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
                        onClick={() => setSidebarOpen(false)}
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
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 hover:bg-muted lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Today</p>
              <p className="text-lg font-semibold">Tuesday, 7 October 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary">Support</Button>
            <Button>Provision university</Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
