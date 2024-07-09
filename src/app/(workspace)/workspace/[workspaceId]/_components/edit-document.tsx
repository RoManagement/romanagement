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
import { createDocumentSchema } from "@/server/api/routers/document/document.input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AnnouncementPreview } from "./announcement-preview";
import { LoadingButton } from "@/components/loading-button";

const markdownlink = "https://remarkjs.github.io/react-markdown/";

interface Props {
  workspaceId: string;
  document: RouterOutputs["document"]["get"];
  setOptimisticDocuments: (action: {
    action: "add" | "delete" | "update";
    document: RouterOutputs["document"]["myDocuments"][number];
  }) => void;
}

export const EditDocument = ({ workspaceId, document, setOptimisticDocuments }: Props) => {
  if (!document) {
    return null;
  }
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const updateDocument = api.document.update.useMutation();
  const deleteDocument = api.document.delete.useMutation();
  const [isCreatePending, startCreateTransaction] = React.useTransition();
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  const form = useForm({
    defaultValues: {
      title: document.title,
      googleDocumentLink: document.googleDocumentLink,
      workspaceId: workspaceId,
    },
    resolver: zodResolver(createDocumentSchema),
  });
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = form.handleSubmit(async (values) => {
    startCreateTransaction(async () => {
      await updateDocument.mutateAsync(
        {
          id: document.id,
          ...values,
        },
        {
          onSettled: () => {
            setOptimisticDocuments({
              action: "update",
              document: {
                ...document,
                ...values,
              },
            })
          },
          onSuccess: () => {
            toast.success("Announcement updated");
            setOpen(false);
            router.refresh();
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
        await deleteDocument.mutateAsync(
          { id: document.id },
          {
            onSettled: () => {
              setOptimisticDocuments({
                action: "delete",
                document,
              });
            },
            onSuccess: () => {
              toast.success("Document deleted");
              router.refresh();
              setOpen(false);
            },
            onError: () => {
              toast.error("Failed to delete document");
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
