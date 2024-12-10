"use client";

import { useEffect, useState } from "react";

import { RecipeInstructions } from "@/components/ImportBar";

import { createClient } from "@/utils/supabase/client";

import { Card, CardFooter } from "@nextui-org/card";

import React from "react";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";

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
    <main className="flex relative h-full w-screen flex-row items-start justify-center py-8 md:py-36">
      <div className="grid grid-cols-1 gap-y-8 gap-x-16 max-w-[1440px] md:gap-y-16 md:grid-cols-2 xl:grid-cols-3">
        {recipes &&
          recipes.map((recipe, id) => {
            const { name, image } = recipe;
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
