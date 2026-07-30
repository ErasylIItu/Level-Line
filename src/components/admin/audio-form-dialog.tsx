"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";

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
import {
  audioFormSchema,
  type AudioFormValues,
} from "@/lib/validations/admin";
import type { ListeningAudio } from "@/types";
import { uploadAudioFile } from "@/lib/api/admin-client";

export function AudioFormDialog({
  open,
  onOpenChange,
  audio,
  onSave,
  saving = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audio?: ListeningAudio | null;
  onSave: (values: AudioFormValues) => Promise<void>;
  saving?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AudioFormValues>({
    resolver: zodResolver(audioFormSchema),
    defaultValues: { title: "", audioUrl: "" },
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setUploadError(null);
    reset(
      audio
        ? { title: audio.title, audioUrl: audio.audioUrl }
        : { title: "", audioUrl: "" }
    );
  }, [open, audio, reset]);

  const audioUrl = watch("audioUrl");

  async function handleFileChange(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const url = await uploadAudioFile(file);
      setValue("audioUrl", url, { shouldValidate: true });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: AudioFormValues) {
    await onSave(values);
  }

  const busy = saving || uploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{audio ? "Edit audio" : "New audio"}</DialogTitle>
          <DialogDescription>
            Audio can contain an unlimited number of questions, added after
            saving.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="audioTitle">Title</Label>
            <Input id="audioTitle" {...register("title")} />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label>Audio file</Label>
            <label
              htmlFor="audioFile"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-8 text-center transition-colors hover:bg-secondary/60"
            >
              {uploading ? (
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              ) : audioUrl ? (
                <CheckCircle2 className="size-6 text-primary" />
              ) : (
                <UploadCloud className="size-6 text-muted-foreground" />
              )}
              <span className="break-all text-sm font-medium text-foreground">
                {uploading
                  ? "Uploading..."
                  : audioUrl
                    ? audioUrl.split("/").pop()
                    : "Click to upload an audio file"}
              </span>
              <span className="text-xs text-muted-foreground">
                MP3 or WAV, uploaded directly to Supabase Storage
              </span>
              <input
                id="audioFile"
                type="file"
                accept="audio/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
            </label>
            {uploadError && (
              <p className="text-xs text-destructive">{uploadError}</p>
            )}
            {errors.audioUrl && (
              <p className="text-xs text-destructive">
                {errors.audioUrl.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy || !audioUrl}>
              {saving ? "Saving..." : audio ? "Save changes" : "Create audio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
