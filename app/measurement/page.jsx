"use client";

import { createMeasurement } from "@/actions/recipe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { measurementSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddMeasurement = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(measurementSchema),
  });

  const {
    data: measurement,
    loading,
    error,
    fn: createMeasurementFN,
  } = useFetch(createMeasurement);

  useEffect(() => {
    if (measurement) {
      toast.success("Measurement created successfully.");
      router.push("/");
    }
  }, [measurement]);

  // Ensure both organization and user are loaded before rendering

  const onSubmit = async (data) => {
    await createMeasurementFN(data);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Measurement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name?.message}</p>
              )}
            </div>

            

            <Button
              disabled={loading}
              className={`text-white ${loading ? "bg-gray-500" : "bg-blue-500"}`}
              type="submit"
              size="lg"
            >
              {loading ? "Creating..." : "Create Measurement"}
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

export default AddMeasurement;