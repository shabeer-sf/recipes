"use server";

import { db } from "@/lib/prisma";

export async function createRecipe(data) {
  try {
    console.log("Received data:", data);

    // Create the recipe
    const recipe = await db.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        tips: data.tips,
        ingredients: {
          create: data.ingredients.map((ingredient) => ({
            name: ingredient.name,
            quantity: parseFloat(ingredient.quantity), // Ensure quantity is stored as a number
            measurementId: ingredient.measurementId || null, // Handle optional measurement
          })),
        },
      },
      include: {
        ingredients: true, // Include the created ingredients in the response
      },
    });

    console.log("Recipe created successfully:", recipe);
    return recipe;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw new Error("Failed to create the recipe. Please try again.");
  }
}


export async function getRecipes({
  page = 1,
  limit = 15,
  search = "",
  sort = "latest",
}) {
  try {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          title: {
            contains: search,
            mode: "insensitive", // Case-insensitive search
          },
        }
      : {};

    // Fetch recipes with pagination and search filter
    const recipes = await db.recipe.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: sort == "latest" ? "desc" : "asc", // Sort by the most recently created
      },
      include: {
        ingredients: {
          include: {
            measurement: true, // Include the related measurement for each ingredient
          },
        },
      },
    });

    // Get total count for pagination calculation
    const totalCount = await db.recipe.count({ where });

    return {
      recipes,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes.");
  }
}

export async function createMeasurement(data) {
  try {
    console.log("Received data:", data);

    // Ensure valid input
    if (!data || !data.name) {
      throw new Error("Invalid data: 'name' is required");
    }

    // Create a new measurement record
    const measurement = await db.measurement.create({
      data: {
        name: data.name,
      },
    });

    console.log("Measurement created:", measurement);
    return measurement;
  } catch (error) {
    console.error("Error creating measurement:", error);
    throw error;
  }
}

export async function getMeasurement() {
  try {


    // Fetch recipes with pagination and search filter
    const measurements = await db.measurement.findMany();

    // Get total count for pagination calculation

    return measurements
  } catch (error) {
    console.error("Error fetching measurement:", error);
    throw new Error("Failed to fetch measurement.");
  }
}

export async function getRecipeById(id) {
  try {
    if (!id) {
      throw new Error("Recipe ID is required");
    }

    // Fetch the recipe by ID, including the related ingredients and measurements
    const recipe = await db.recipe.findUnique({
      where: {
        id: id, // Find the recipe by its unique ID
      },
      include: {
        ingredients: {
          include: {
            measurement: true, // Include the measurement for each ingredient
          },
        },
      },
    });

    // Check if the recipe exists
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipe;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw new Error("Failed to fetch the recipe. Please try again.");
  }
}
