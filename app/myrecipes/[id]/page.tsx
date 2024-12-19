import { RecipeInstructions } from "@/components/ImportBar";
import RecipeViewer from "@/components/RecipeViewer";
import { createClient } from "@/utils/supabase/server";

import React, { cache } from "react";
import { getRecipes } from "../page";

import BackButton from "@/components/BackButton";
import { Button } from "@nextui-org/button";

import Link from "next/link";

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

export const getRecipe = cache(async (id: string) => {
  const supabase = createClient();
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
});

export default async function MyRecipe({ id }: { id: string }) {
  /* ------- Fetch recipe instructions ------- */

  const currentRecipe = await getRecipe(id);

  return (
    <main className="flex relative h-full w-screen overflow-hidden flex-col items-start justify-start">
      <div className="flex flex-row w-screen gap-2 p-4 z-10 sm:w-min">
        <BackButton
          className="flex-1"
          text="My Recipes"
          pathname="/myrecipes"
        />
        <Link
          href={{
            pathname: "/editrecipe",
            query: { recipeId: id },
          }}
        >
          <Button
            className="flex-1 font-league-spartan text-lg text-white w-full"
            color="success"
            size="lg"
            radius="sm"
            variant="solid"
          >
            Edit this recipe
          </Button>
        </Link>
      </div>
      <section className="relative flex flex-col h-full w-full pt-8 overflow-scroll">
        <RecipeViewer
          recipe={currentRecipe}
          emptyText="No recipe loaded. Choose a recipe and it will show up here!"
        />
      </section>
    </main>
  );
}
