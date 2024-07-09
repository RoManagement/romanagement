"use client";
import { type RouterOutputs } from "@/trpc/shared";
import Link from "next/link";
import { Bell, Home, LineChart, Users, ClipboardMinus, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { WorkspaceSettings } from "./workspace-settings";
import { WorkspaceAnnouncements } from "./workspace-announcements";
import { WorkspaceDocumentation } from "./workspace-documentation";
import { WorkspaceDashboard } from "./workspace-dashboard";

interface Props {
  workspace: RouterOutputs["workspace"]["get"];
  postPromises: Promise<[RouterOutputs["post"]["myPosts"], RouterOutputs["stripe"]["getPlan"]]>;
  documentPromises: Promise<[RouterOutputs["document"]["myDocuments"], RouterOutputs["stripe"]["getPlan"]]>;
}

export const WorkspaceNav = ({ workspace, postPromises, documentPromises }: Props) => {
  if (!workspace) return null;

  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const isButtonActive = (section: string) => {
    return section === activeSection ? "bg-muted" : "";
  };

  const [posts, subscriptionPlan] = React.use(postPromises);

  if (!subscriptionPlan) return null;

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <WorkspaceDashboard />;
      case "announcements":
        return <WorkspaceAnnouncements workspaceId={workspace.id} promises={postPromises} />;
      case "documentation":
        return <WorkspaceDocumentation workspaceId={workspace.id} promises={documentPromises} />;
      case "workspace-members":
        return <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6"></main>;
      case "analytics":
        return <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">Hello!</main>;
      case "workspace-settings":
        return <WorkspaceSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-full w-64 bg-muted/40 border-r shadow-md z-10">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-4 font-semibold">
              <img
                src={workspace.logo ?? ""}
                alt={workspace.name ?? ""}
                className="h-[45px] w-[45px]"
              />
              <span className="text-sm">{workspace.name}</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                onClick={() => handleSectionChange("dashboard")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isButtonActive(
                  "dashboard",
                )}`}
              >
                <Home className="h-4 w-4" />
                Workspace Dashboard
              </Link>
              <Link
                href="#"
                onClick={() => handleSectionChange("announcements")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isButtonActive(
                  "announcements",
                )}`}
              >
                <Bell className="h-4 w-4" />
                Announcements
              </Link>
              <Link
                href="#"
                onClick={() => handleSectionChange("documentation")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isButtonActive(
                  "documentation",
                )}`}
              >
                <ClipboardMinus className="h-4 w-4" />
                Documentation
              </Link>
              <Link
                href="#"
                onClick={() => handleSectionChange("workspace-members")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isButtonActive(
                  "workspace-members",
                )}`}
              >
                <Users className="h-4 w-4" />
                Workspace Members
              </Link>
              <Link
                href="#"
                onClick={() => handleSectionChange("analytics")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isButtonActive(
                  "analytics",
                )}`}
              >
                <LineChart className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                href="#"
                onClick={() => handleSectionChange("workspace-settings")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isButtonActive(
                  "workspace-settings",
                )}`}
              >
                <Settings className="h-4 w-4" />
                Workspace Settings
              </Link>
            </nav>
          </div>
          <div className="mt-auto items-center p-4">
            <div className="mb-4">
              <Link
                href="/dashboard"
                className="mb-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:underline"
              >
                <ArrowLeft className="h-5 w-5" /> Back to Dashboard
              </Link>
            </div>
            {!subscriptionPlan.isPro && (
              <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>
                    Unlock all features and get unlimited access to our support team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Button size="sm" className="w-full">
                    <Link href="/dashboard/billing">Upgrade</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <div className="ml-64 w-full p-4">
        {renderSection()}
      </div>
    </div>
  );
};
