"use client";

import { createRecipe } from "@/actions/recipe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { recipeSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddVideoForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
  });

  const {
    data: recipe,
    loading,
    error,
    fn: createRecipeFN,
  } = useFetch(createRecipe);

  useEffect(() => {
    if (recipe) {
      toast.success("Recipe created successfully.");
      router.push(`/`);
    }
  }, [recipe]);

  // Ensure both organization and user are loaded before rendering

  const onSubmit = async (data) => {
    await createRecipeFN(data);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Video Description"
                {...register("description")}
                className={errors.description ? "border-red-500" : ""}
              />

              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeLink">YouTube URL or Video ID</Label>
              <Input
                id="youtubeLink"
                {...register("youtubeLink")}
                className={errors.youtubeLink ? "border-red-500" : ""}
              />
              {errors.youtubeLink && (
                <p className="text-sm text-red-500">
                  {errors.youtubeLink?.message}
                </p>
              )}
            </div>

            <Button
              disabled={loading}
              className={`text-white ${
                loading ? "bg-gray-500" : "bg-blue-500"
              }`}
              type="submit"
              size="lg"
            >
              {loading ? "Creating..." : "Create Video"}
            </Button>

            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVideoForm;
