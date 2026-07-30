import { z } from "zod";

export const questionFormSchema = z
  .object({
    prompt: z.string().min(5, "Question text is too short"),
    optionA: z.string().min(1, "Required"),
    optionB: z.string().min(1, "Required"),
    optionC: z.string().min(1, "Required"),
    optionD: z.string().min(1, "Required"),
    correctOption: z.enum(["a", "b", "c", "d"]),
  })
  .strict();

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

export const passageFormSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  body: z.string().min(20, "Passage body is too short"),
});

export type PassageFormValues = z.infer<typeof passageFormSchema>;

export const audioFormSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  audioUrl: z.string().min(1, "Please upload or link an audio file"),
});

export type AudioFormValues = z.infer<typeof audioFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
