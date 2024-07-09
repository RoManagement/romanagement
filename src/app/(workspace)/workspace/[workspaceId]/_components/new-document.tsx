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
import { AnnouncementPreview } from "./announcement-preview";
import { LoadingButton } from "@/components/loading-button";
import { useState } from "react";

interface Props {
  workspaceId: string;
}

export const NewDocument = ({ workspaceId }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const post = api.post.create.useMutation();
  const [isCreatePending, startCreateTransaction] = React.useTransition();
  const form = useForm({
    defaultValues: {
      title: "Untitled Announcement",
      googleDocumentLink: "",
      workspaceId: workspaceId,
    },
    resolver: zodResolver(createPostSchema),
  });
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = form.handleSubmit(async (values) => {
    startCreateTransaction(async () => {
      console.log(values);
    });
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button
          className="flex cursor-pointer items-center justify-center bg-card p-6 text-muted-foreground transition-colors hover:bg-secondary/10 dark:border-none dark:bg-secondary/30 dark:hover:bg-secondary/50"
          asChild
        >
          <div className="flex flex-col items-center">
            <p className="text-sm">Add Google Document</p>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Add Google Document</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form ref={formRef} onSubmit={onSubmit} className="block max-w-screen-md space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="googleDocumentLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Document Link</FormLabel>
                  <FormControl>
                    <Input {...field} className="min-h-0" />
                  </FormControl>
                  <FormDescription>You can only add google documents. Please ensure that the link works.</FormDescription>
                  <FormMessage />
                </FormItem>
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
          Add
        </LoadingButton>
        <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};
