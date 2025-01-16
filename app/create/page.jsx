"use client";

import { createRecipe, getMeasurement } from "@/actions/recipe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipeSchema } from "@/lib/validators";
import useFetch from "@/hooks/use-fetch";

const AddRecipeForm = () => {
  const router = useRouter();
  const [measurements, setMeasurements] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      ingredients: [{ name: "", quantity: "", measurementId: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  // Fetch measurements
  const fetchMeasurements = async () => {
    const measureMentData = await getMeasurement();
    setMeasurements(measureMentData);
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

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

  const onSubmit = async (data) => {
    await createRecipeFN(data);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
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
              <Label htmlFor="youtubeLink">Youtube Link</Label>
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

            {/* Ingredients */}
            <div className="space-y-4">
              <Label>Ingredients</Label>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col md:flex-row gap-4 items-start md:items-center"
                >
                  {/* Ingredient Name */}
                  <div className="flex-grow">
                    <Label htmlFor={`ingredients.${index}.name`}>Name</Label>
                    <Input
                      id={`ingredients.${index}.name`}
                      {...register(`ingredients.${index}.name`)}
                      className={
                        errors.ingredients?.[index]?.name
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.ingredients?.[index]?.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.ingredients[index].name.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="flex-grow">
                    <Label htmlFor={`ingredients.${index}.quantity`}>
                      Quantity
                    </Label>
                    <Input
                      id={`ingredients.${index}.quantity`}
                      type="number"
                      step="0.01"
                      {...register(`ingredients.${index}.quantity`)}
                      className={
                        errors.ingredients?.[index]?.quantity
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.ingredients?.[index]?.quantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.ingredients[index].quantity.message}
                      </p>
                    )}
                  </div>

                  {/* Measurement Select */}
                  <div className="flex-grow">
                    <Controller
                      name={`ingredients.${index}.measurementId`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Measurement" />
                          </SelectTrigger>
                          <SelectContent>
                            {measurements.map((measurement) => (
                              <SelectItem
                                key={measurement.id}
                                value={measurement.id}
                              >
                                {measurement.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    className="bg-red-500 text-white"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                className="bg-green-500 text-white"
                onClick={() =>
                  append({ name: "", quantity: "", measurementId: "" })
                }
              >
                Add Ingredient
              </Button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Recipe Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MDEditor value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description?.message}
                </p>
              )}
            </div>

            {/* Tips */}
            <div className="space-y-2">
              <Label htmlFor="tips">Recipe Tips</Label>
              <Controller
                name="tips"
                control={control}
                render={({ field }) => (
                  <MDEditor value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.tips && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tips?.message}
                </p>
              )}
            </div>
            {/* Submit Button */}
            <Button
              disabled={loading}
              className={`text-white ${
                loading ? "bg-gray-500" : "bg-blue-500"
              }`}
              type="submit"
              size="lg"
            >
              {loading ? "Creating..." : "Create Recipe"}
            </Button>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRecipeForm;
