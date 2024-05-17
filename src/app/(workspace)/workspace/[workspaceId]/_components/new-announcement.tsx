"use client";

import { FilePlusIcon } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/server/api/routers/post/post.input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { NewAnnouncementPreview } from "./new-announcement-preview";
import { LoadingButton } from "@/components/loading-button";
import { useState } from "react";

const markdownlink = "https://remarkjs.github.io/react-markdown/";

interface Props {
  workspaceId: string;
  setOptimisticPosts: (action: {
    action: "add" | "delete" | "update";
    post: RouterOutputs["post"]["myPosts"][number];
  }) => void;
}

export const NewAnnouncement = ({ workspaceId, setOptimisticPosts }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const post = api.post.create.useMutation();
  const [isCreatePending, startCreateTransaction] = React.useTransition();
  const form = useForm({
    defaultValues: {
      title: "Untitled Announcement",
      excerpt: "Write a short description here",
      content: "Write your content here",
      workspaceId: workspaceId
    },
    resolver: zodResolver(createPostSchema),
  });
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = form.handleSubmit(async (values) => {
    startCreateTransaction(async () => {
      await post.mutateAsync(
        {
          title: values.title,
          content: values.content,
          excerpt: values.excerpt,
          workspaceId: workspaceId
        },
        {
          onSettled: () => {
            setOptimisticPosts({
              action: "add",
              post: {
                id: crypto.randomUUID(),
                title: values.title,
                excerpt: values.excerpt,
                workspaceId: workspaceId,
                content: values.content,
                status: "published",
                createdAt: new Date(),
              },
            });
          },
          onSuccess: ({ id }) => {
            toast.success("Announcement created");
            setOpen(false);
          },
          onError: () => {
            toast.error("Failed to create announcement");
          },
        },
      );
    });
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button
          className="flex h-full cursor-pointer items-center justify-center bg-card p-6 text-muted-foreground transition-colors hover:bg-secondary/10 dark:border-none dark:bg-secondary/30 dark:hover:bg-secondary/50"
          asChild
        >
          <div className="flex flex-col items-center gap-4">
            <FilePlusIcon className="h-10 w-10" />
            <p className="text-sm">New Announcement</p>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">New Announcement</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form ref={formRef} onSubmit={onSubmit} className="block max-w-screen-md space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} className="min-h-0" />
                  </FormControl>
                  <FormDescription>A short description of your post</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <Tabs defaultValue="code">
                  <TabsList>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="code">
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} className="min-h-[200px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </TabsContent>
                  <TabsContent value="preview" className="space-y-2">
                    <div className="prose prose-sm min-h-[200px] max-w-[none] rounded-lg border px-3 py-2 dark:prose-invert">
                      <NewAnnouncementPreview text={form.watch("content")} />
                    </div>
                  </TabsContent>
                  <Link href={markdownlink}>
                    <span className="text-[0.8rem] text-muted-foreground underline underline-offset-4">
                      Supports markdown
                    </span>
                  </Link>
                </Tabs>
              )}
            />
          </form>
        </Form>
        <LoadingButton
          disabled={!form.formState.isDirty}
          loading={isCreatePending}
          onClick={() => formRef.current?.requestSubmit()}
          className="ml-auto w-full"
        >
          Post
        </LoadingButton>
        <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};
