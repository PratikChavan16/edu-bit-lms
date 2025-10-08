"use client";

import { useState } from "react";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";
import { Separator } from "@bitflow/ui/separator";

const tabs = ["Notes", "Video lectures", "Assessments", "E-books", "Bookmarks"] as const;

const resources = [
  {
    title: "Fluid Mechanics – Module 3",
    description: "Concept summary with solved examples.",
    subject: "Mechanical",
    type: "Notes",
    size: "4.5 MB",
    updated: "2d ago",
  },
  {
    title: "Digital Electronics Mock Test",
    description: "Timed assessment with 30 MCQs.",
    subject: "Electronics",
    type: "Assessments",
    size: "30 mins",
    updated: "5d ago",
  },
  {
    title: "Engineering Ethics",
    description: "Recommended book chapters.",
    subject: "Common",
    type: "E-books",
    size: "2.1 MB",
    updated: "1w ago",
  },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Notes");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Library</h1>
          <p className="text-muted-foreground">Search resources shared by your faculty and admins.</p>
        </div>
        <Input placeholder="Search resources by keyword…" className="md:max-w-sm" />
      </div>
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={tab === activeTab ? "default" : "ghost"}
            className="rounded-full"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
      <Separator />
      <div className="grid gap-4 lg:grid-cols-3">
        {resources
          .filter((resource) => resource.type === activeTab || activeTab === "Bookmarks")
          .map((resource) => (
            <article key={resource.title} className="space-y-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{resource.title}</h2>
                <Badge variant="secondary">{resource.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{resource.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{resource.subject}</span>
                <span>{resource.size}</span>
                <span>{resource.updated}</span>
              </div>
              <Button size="sm">Open</Button>
            </article>
          ))}
      </div>
    </div>
  );
}
