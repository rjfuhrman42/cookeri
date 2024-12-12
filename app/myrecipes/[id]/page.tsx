import { RecipeInstructions } from "@/components/ImportBar";
import RecipeViewer from "@/components/RecipeViewer";
import { createClient } from "@/utils/supabase/server";

import React from "react";
import { getRecipes } from "../page";

import BackButton from "@/components/BackButton";

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
};

export default async function MyRecipe({ id }: { id: string }) {
  const supabase = createClient();

  /* ------- Fetch recipe instructions ------- */

  async function getRecipe(id: string) {
    const recipes = await getRecipes();
    if (!recipes) return;

    const recipe = recipes.find((recipe) => recipe.id == id);

    const parsedRecipe = supabase
      .from("recipe_instructions")
      .select()
      .eq("recipe_id", id)
      .then(({ data, error }) => {
        if (error) {
          console.error("error fetching recipe instructions", error.message);
          return;
        }

        if (!data) return;
        /* <a href="https://storyset.com/online">Online illustrations by Storyset</a> */
        // <a href="https://storyset.com/book">Book illustrations by Storyset</a>
        const recipeInstructions = data
          .map((step: RecipeInstructions) => {
            return { name: step.name, steps: step.steps, id: step.id };
          })
          .sort((cur, next) => {
            if (!cur.id || !next.id) return 0;
            // Sort by ID - maybe add an order column in the future
            // Not sure if ID will always represent the order
            if (cur.id && next.id) {
              return cur.id - next.id;
            }
            return 0;
          });

        const parsedRecipe = {
          url: recipe?.url,
          name: recipe.name,
          description: recipe.description,
          prepTime: recipe.prep_time,
          cookTime: recipe.cook_time,
          totalTime: recipe?.total_time,
          recipeYield: recipe.recipe_yield,
          recipeIngredient: recipe.recipe_ingredients,
          recipeInstructions,
          image: recipe.image,
          author: recipe.author,
          id: recipe.id,
        };

        return parsedRecipe;
      });
    return parsedRecipe;
  }

  const currentRecipe = await getRecipe(id);

  return (
    <main className="flex relative h-full w-screen overflow-hidden flex-row items-start justify-start">
      <div className="absolute top-4 left-4 z-10">
        <BackButton text="Back to My Recipes" />
      </div>
      <section className="fixed md:relative flex flex-col h-full w-full p-0 overflow-hidden">
        <RecipeViewer
          recipe={currentRecipe}
          emptyText="No recipe loaded. Choose a recipe and it will show up here!"
        />
      </section>
    </main>
  );
}
