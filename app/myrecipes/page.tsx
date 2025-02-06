import { RecipeInstructions } from "@/components/ImportBar";

import React, { cache } from "react";

import { createClient } from "@/utils/supabase/server";
import { BookSquareIcon } from "@/components/icons";

import RecipesList from "@/components/RecipesList";

export type Recipe = {
  url?: string;
  name: string;
  description: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield: string;
  recipeIngredient: string[];
  recipeInstructions: RecipeInstructions[];
  image: string;
  author?: string;
  id?: number;
  created_at?: string;
};

const getRecipes = cache(async () => {
  const supabase = createClient();
  const recipes = await supabase
    .from("recipe")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error("error fetching recipes", error.message);
        return;
      }
      if (data) {
        return data;
      }
    });
  return recipes;
});

export default async function MyRecipes() {
  /* ------- Fetch recipes ------- */
  const recipes = (await getRecipes()) as Recipe[];

  return (
    <main className="flex relative w-screen flex-col items-center justify-center pt-8">
      <div className="flex flex-row items-center justify-center gap-2">
        <BookSquareIcon height={50} width={50} stroke="black" />
        <h1 className="font-bold">My Recipes</h1>
      </div>
      <RecipesList recipes={recipes} />
    </main>
  );
}
