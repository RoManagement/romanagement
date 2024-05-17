"use client";

import { useRef } from "react";
import { type RouterOutputs } from "@/trpc/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WorkspacePreview } from "./workspace-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { Pencil2Icon } from "@/components/icons";
import { LoadingButton } from "@/components/loading-button";
import Link from "next/link";
import { createPostSchema } from "@/server/api/routers/post/post.input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bell, Home, LineChart, Users, ClipboardMinus, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkspaceSettings } from "./workspace-settings";
import { WorkspaceAnnouncements } from "./workspace-announcements";
import { WorkspaceDocumentation } from "./workspace-documentation";
import { WorkspaceDashboard } from "./workspace-dashboard";

const markdownlink = "https://remarkjs.github.io/react-markdown/";

interface Props {
  workspace: RouterOutputs["workspace"]["get"];
  promises: Promise<[RouterOutputs["post"]["myPosts"], RouterOutputs["stripe"]["getPlan"]]>;
}

export const WorkspaceEditor = ({ workspace, promises }: Props) => {
  if (!workspace) return null;

  const [activeSection, setActiveSection] = useState("dashboard");

  // Function to handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const isButtonActive = (section: string) => {
    return section === activeSection ? "bg-muted" : "";
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <WorkspaceDashboard />;
      case "announcements":
        return <WorkspaceAnnouncements workspaceId={workspace.id} promises={promises} />;
      case "documentation":
        return <WorkspaceDocumentation />;
      case "workspace-members":
        return <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6"></main>;
      case "analytics":
        return <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">Hello!</main>;
      case "workspace-settings":
        return <WorkspaceSettings />;
      // Add more cases for other sections as needed
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
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
            <div className="flex-1">
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
              <Card x-chunk="dashboard-02-chunk-0">
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
            </div>
          </div>
        </div>
        {/* Main content */}
        <div className="flex flex-col">
          {/* Conditionally render different sections */}
          {renderSection()}
        </div>
      </div>
    </>
  );
};
