"use client";

import { useEffect, useState } from "react";

import { RecipeInstructions } from "@/components/ImportBar";

import { createClient } from "@/utils/supabase/client";

import { Card, CardFooter } from "@nextui-org/card";

import React from "react";
import { Image } from "@nextui-org/image";

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

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<any[] | undefined>();

  const supabase = createClient();

  /* ------- Fetch recipes ------- */
  useEffect(() => {
    supabase
      .from("recipe")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error("error fetching recipes", error.message);
          return;
        }
        if (data) {
          setRecipes(data);
        }
      });
  }, [supabase]);

  return (
    <main className="flex relative h-full w-screen flex-row items-start justify-center py-36">
      <div className="container flex justify-start px-24 gap-10 flex-wrap">
        {recipes &&
          recipes.map((recipe, id) => {
            const { name, image } = recipe;
            return (
              <Card className="w-[400px]" key={id} radius="sm">
                <Image
                  alt="Card background"
                  className="object-cover"
                  src={image}
                  width={400}
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
