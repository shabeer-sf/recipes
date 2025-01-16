import { z } from "zod";

export const recipeSchema = z.object({
  title: z.string().min(1, "Recipe title is required"),
  description: z.string().optional(),
  tips: z.string().optional(),
  youtubeLink: z.string().optional(),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name is required"),
        quantity: z.string().min(1, "Quantity is needed."),
        measurementId: z.string().min(1, "Measurement ID is required"),
      })
    )
    .nonempty("At least one ingredient is required"),
});


export const measurementSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
