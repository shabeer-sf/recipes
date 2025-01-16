"use server";
import { db } from "@/lib/prisma";

export async function createRecipe(data) {
  console.log("data", data);

  const recipe = await db.recipe.create({
    data: {
      title: data.title,
      description: data.description,
      youtubeLink: data.youtubeLink,
    },
  });
  return recipe;
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
