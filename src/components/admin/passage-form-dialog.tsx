"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  passageFormSchema,
  type PassageFormValues,
} from "@/lib/validations/admin";
import type { ReadingPassage } from "@/types";

export function PassageFormDialog({
  open,
  onOpenChange,
  passage,
  onSave,
  saving = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passage?: ReadingPassage | null;
  onSave: (values: PassageFormValues) => Promise<void>;
  saving?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PassageFormValues>({
    resolver: zodResolver(passageFormSchema),
    defaultValues: { title: "", body: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset(passage ? { title: passage.title, body: passage.body } : { title: "", body: "" });
  }, [open, passage, reset]);

  async function onSubmit(values: PassageFormValues) {
    await onSave(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{passage ? "Edit passage" : "New passage"}</DialogTitle>
          <DialogDescription>
            Passages can contain an unlimited number of questions, added
            after saving.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="body">Passage text</Label>
            <Textarea id="body" rows={8} {...register("body")} />
            {errors.body && (
              <p className="text-xs text-destructive">{errors.body.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : passage ? "Save changes" : "Create passage"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
