import { RecipeInstructions } from "@/components/ImportBar";

import { Card, CardFooter } from "@nextui-org/card";

import React, { cache } from "react";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { createClient } from "@/utils/supabase/server";
import { BookSquareIcon } from "@/components/icons";

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

export const getRecipes = cache(async () => {
  const supabase = createClient();
  const recipes = await supabase
    .from("recipe")
    .select("*")
    .then(({ data, error }) => {
      if (error) {
        console.error("error fetching recipes", error.message);
        return [];
      }
      if (data) {
        return data;
      }
    });
  return recipes;
});

export default async function MyRecipes() {
  /* ------- Fetch recipes ------- */
  const recipes = await getRecipes();

  return (
    <main className="flex relative h-full w-screen flex-col items-center justify-center py-16">
      <div className="flex flex-row items-center justify-center gap-2 pb-16">
        <BookSquareIcon height={50} width={50} stroke="black" />
        <h1 className="font-bold">My Recipes</h1>
      </div>
      <div className="grid grid-cols-1 gap-y-8 gap-x-16 max-w-[1440px] md:gap-y-16 md:grid-cols-2 xl:grid-cols-3">
        {recipes &&
          recipes.map((recipe) => {
            const { name, image, id } = recipe;
            return (
              <Card
                isPressable
                radius="sm"
                className="w-[350px]"
                key={id}
                as={Link}
                href={`myrecipes/${id}`}
              >
                <Image
                  alt="Card background"
                  className="object-cover p-2 rounded-xl"
                  src={image}
                  width={350}
                  height={250}
                  radius="none"
                />
                <CardFooter className="pt-4">
                  <h2 className="font-bold text-2xl">{name}</h2>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </main>
  );
}
