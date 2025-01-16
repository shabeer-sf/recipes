"use client"
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from 'next/navigation';
import { getRecipeById } from '@/actions/recipe';

const RecipeDetailPage = () => {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const { id } = useParams();
  
    const fetchRecipe = async () => {
      setLoading(true);
      const fetchRecipeData = await getRecipeById(id);
      setRecipe(fetchRecipeData);
      setLoading(false);
    };
  
    useEffect(() => {
      fetchRecipe();
    }, [id]);
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      );
    }
  
    if (!recipe) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <p className="text-xl text-gray-600">Recipe not found</p>
        </div>
      );
    }
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Recipe Title */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {recipe.title}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-auto">
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-gray-100 border-b">
              <div className="p-4 font-medium text-sm w-12">#</div>
              <div className="p-4 font-medium text-sm">Ingredient</div>
              <div className="p-4 font-medium text-sm">Quantity</div>
              <div className="p-4 font-medium text-sm">Measurement</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y">
              {recipe.ingredients.map((ingredient,index) => (
                <div key={ingredient.id} className="grid grid-cols-4 hover:bg-gray-50">
                  <div className="p-4 text-sm">{index+1}</div>
                  <div className="p-4 text-sm font-medium">{ingredient.name}</div>
                  <div className="p-4 text-sm">{ingredient.quantity}</div>
                  <div className="p-4 text-sm">{ingredient.measurement.name}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {
        recipe?.description && (
            <Card>
        <CardHeader>
          <CardTitle className="text-xl">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-gray-700">
            {recipe.description}
          </p>
        </CardContent>
      </Card>
        ) 
      }
      {
        recipe?.tips && (
            <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-gray-700">
            {recipe.tips}
          </p>
        </CardContent>
      </Card>
        ) 
      }
    </div>
  );
};

export default RecipeDetailPage;