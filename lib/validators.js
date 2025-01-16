import { z } from "zod";

export const recipeSchema = z.object({
  title: z.string().min(1, "Video name is required"),
  description: z.string().optional(),
  youtubeLink: z.string().min(1, "Youtube link is required"),
});
