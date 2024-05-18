"use client";

import { FilePlusIcon, Pencil2Icon, TrashIcon } from "@/components/icons";
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
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/server/api/routers/post/post.input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AnnouncementPreview } from "./announcement-preview";
import { LoadingButton } from "@/components/loading-button";

const markdownlink = "https://remarkjs.github.io/react-markdown/";

interface Props {
  workspaceId: string;
  post: RouterOutputs["post"]["get"];
  setOptimisticPosts: (action: {
    action: "add" | "delete" | "update";
    post: RouterOutputs["post"]["myPosts"][number];
  }) => void;
}

export const EditAnnouncement = ({ workspaceId, post, setOptimisticPosts }: Props) => {
  if (!post) {
    return null;
  }
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const updatePost = api.post.update.useMutation();
  const deletePost = api.post.delete.useMutation();
  const [isCreatePending, startCreateTransaction] = React.useTransition();
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  const form = useForm({
    defaultValues: {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      workspaceId: workspaceId,
    },
    resolver: zodResolver(createPostSchema),
  });
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = form.handleSubmit(async (values) => {
    startCreateTransaction(async () => {
      await updatePost.mutateAsync(
        {
          id: post.id,
          ...values,
        },
        {
          onSuccess: () => {
            toast.success("Announcement updated");
            setOpen(false);
          },
          onError: () => {
            toast.error("Failed to update announcement");
          },
        },
      );
    });
  });

  const handleDeleteClick = () => {
    if (clickCount === 1) {
      startDeleteTransition(async () => {
        await deletePost.mutateAsync(
          { id: post.id },
          {
            onSettled: () => {
              setOptimisticPosts({
                action: "delete",
                post,
              });
            },
            onSuccess: () => {
              toast.success("Post deleted");
              router.refresh();
              setOpen(false);
            },
            onError: () => {
              toast.error("Failed to delete post");
            },
          },
        );
      });
    } else {
      setClickCount(1);
      setTimeout(() => {
        setClickCount(0);
      }, 3000); // Reset click count after 3 seconds
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button variant="secondary" size="sm" className="w-full" asChild>
          <div>
            <Pencil2Icon className="mr-1 h-4 w-4" />
            <span>Edit</span>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Edit</AlertDialogTitle>
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
                    <div className="prose prose-sm max-h-[200px] max-w-[none] overflow-y-auto rounded-lg border px-3 py-2 dark:prose-invert">
                      <AnnouncementPreview text={form.watch("content")} />
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
          Update
        </LoadingButton>
        <Button
          disabled={isDeletePending}
          variant="destructive"
          className="w-full"
          onClick={handleDeleteClick}
        >
          {clickCount === 0
            ? "Delete (Click Twice to Confirm)"
            : "Are you sure? Click again to delete"}
        </Button>
        <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};
