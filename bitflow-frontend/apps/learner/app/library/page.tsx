"use client";

import { useState } from "react";
import { useLearnerLibraryResources, useToggleLearnerBookmark } from "@bitflow/api-client/learner";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";
import { Separator } from "@bitflow/ui/separator";
import { AlertCircle, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";

const tabs = ["Notes", "Video lectures", "Assessments", "E-books", "Bookmarks"] as const;

type TabType = typeof tabs[number];

const resourceTypeMap: Record<TabType, string | undefined> = {
  "Notes": "note",
  "Video lectures": "video",
  "Assessments": "assessment",
  "E-books": "ebook",
  "Bookmarks": undefined, // Special case - shows bookmarked resources
};

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Notes");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading, error, refetch } = useLearnerLibraryResources(
    activeTab === "Bookmarks" ? { bookmarked: true } : { type: resourceTypeMap[activeTab] }
  );
  
  const toggleBookmark = useToggleLearnerBookmark({
    onSuccess: () => {
      refetch();
    },
  });

  const handleBookmarkToggle = (resourceId: string, currentlyBookmarked: boolean) => {
    toggleBookmark.mutate({ resourceId, bookmarked: !currentlyBookmarked });
  };

  const resources = data?.data || [];
  
  // Filter by search query
  const filteredResources = searchQuery
    ? resources.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : resources;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="flex gap-3">
          {tabs.map((tab) => (
            <div key={tab} className="h-10 w-32 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold">Failed to load library resources</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Library</h1>
          <p className="text-muted-foreground">
            Search resources shared by your faculty and admins • {resources.length} resources
          </p>
        </div>
        <Input
          placeholder="Search resources by keyword…"
          className="md:max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
      
      {filteredResources.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">No resources found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? "Try a different search term" : "No resources available in this category"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <article
              key={resource.id}
              className="space-y-3 rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{resource.title}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{resource.type}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmarkToggle(resource.id, resource.bookmarked || false)}
                    disabled={toggleBookmark.isPending}
                    className="h-8 w-8 p-0"
                  >
                    {toggleBookmark.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : resource.bookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {resource.description && (
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{resource.subject}</span>
                {resource.fileSizeBytes && (
                  <span>{(resource.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                )}
                <span>{new Date(resource.updatedAt).toLocaleDateString()}</span>
              </div>
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <Button size="sm" asChild>
                <a href={resource.previewUrl || '#'} target="_blank" rel="noopener noreferrer">
                  Open
                </a>
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
