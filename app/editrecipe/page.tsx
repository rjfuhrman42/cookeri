"use client";
import { useEffect, useState } from "react";

import SideBar from "@/components/SideBar";
import { RecipeInstructions } from "@/components/ImportBar";
import { Button } from "@nextui-org/button";
import RecipeViewer from "@/components/RecipeViewer";
import {
  ArrowRightIcon,
  CloseCircleIcon,
  EditIcon,
  MaximizeIcon,
  SaveIcon,
} from "@/components/icons";
import { Input } from "@nextui-org/input";
import IngredientsEditor from "@/components/IngredientsEditor";
import StepsEditor from "@/components/StepsEditor";
import { createClient } from "@/utils/supabase/client";
import { UserResponse } from "@supabase/supabase-js";

import { Tooltip } from "@nextui-org/tooltip";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

type editorStateType = "recipeIngredient" | "recipeInstructions" | "editRecipe";

export default function EditRecipe() {
  const [editorState, setEditorState] = useState<editorStateType>("editRecipe");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | undefined>();
  const [initialRecipe, setInitialRecipe] = useState<Recipe | undefined>();

  const [sidebarShown, setSidebarShown] = useState(true);
  const params = useSearchParams();
  const recipeId = params.get("recipeId");
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    if (!recipeId) return;

    supabase
      .from("recipe")
      .select("*")
      .eq("id", recipeId)
      .then(({ data, error }) => {
        if (error) {
          console.error("error fetching recipes", error.message);
          return;
        }
        if (data) {
          const recipe = data[0];
          console.log("recipe data", data);
          supabase
            .from("recipe_instructions")
            .select()
            .eq("recipe_id", recipeId)
            .then(({ data, error }) => {
              if (error) {
                console.error(
                  "error fetching recipe instructions",
                  error.message
                );
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
              } as Recipe;

              setCurrentRecipe(parsedRecipe);

              // Save the initial recipe to compare changes
              // Use this to revert changes if needed
              setInitialRecipe(parsedRecipe);
            });
        }
      });
  }, [supabase, recipeId]);

  /* ------- Fetch recipe instructions ------- */

  async function handleUpdateRecipe() {
    if (!currentRecipe || !currentRecipe.id) return;

    const userData: UserResponse = await supabase.auth.getUser();
    if (!userData?.data?.user) return;

    const payload = {
      name: currentRecipe.name,
      description: currentRecipe.description,
      prep_time: currentRecipe.prepTime,
      cook_time: currentRecipe.cookTime,
      total_time: currentRecipe.totalTime,
      recipe_yield: currentRecipe.recipeYield,
      recipe_ingredients: currentRecipe.recipeIngredient,
      image: currentRecipe.image,
      author: currentRecipe.author,
    };

    try {
      const { data, error } = await supabase
        .from("recipe")
        .update({ ...payload })
        .eq("id", currentRecipe.id)
        .select();

      if (error) {
        console.error("error saving recipe", error.message);
        return;
      }

      if (!data) return;

      // TODO: don't update steps if steps haven't changed
      const { error: stepsError } = await supabase
        .from("recipe_instructions")
        .upsert(
          currentRecipe.recipeInstructions.map((step) => {
            return {
              ...step,
              recipe_id: currentRecipe.id,
              id: step.id,
            };
          })
        )
        .select();
      if (stepsError) {
        console.error("error saving steps", stepsError.message);
        return;
      }
      router.push(`/myrecipes/${currentRecipe.id}`);
    } catch (error) {
      console.error("error", error);
    }
  }

  async function handleDeleteRecipe(recipeId: number) {
    try {
      const { error } = await supabase
        .from("recipe")
        .delete()
        .eq("id", recipeId)
        .select();

      if (error) {
        console.error("error deleting recipe", error.message);
        return;
      }

      setCurrentRecipe(undefined);
      setEditorState("editRecipe");
    } catch (error) {
      console.error("error", error);
    }
  }

  if (editorState === "recipeIngredient" && currentRecipe?.recipeIngredient) {
    return (
      <main className="flex h-full w-screen overflow-hidden flex-row items-start justify-start">
        <IngredientsEditor
          ingredients={currentRecipe.recipeIngredient as string[]}
          onCancel={() => setEditorState("editRecipe")}
          onSave={(data: string[]) => {
            setCurrentRecipe(() => {
              return { ...currentRecipe, recipeIngredient: data };
            });
            setEditorState("editRecipe");
          }}
        />
      </main>
    );
  } else if (editorState === "recipeInstructions" && currentRecipe) {
    return (
      <main className="flex h-full w-screen overflow-hidden flex-row items-start justify-start">
        <StepsEditor
          steps={currentRecipe.recipeInstructions}
          onCancel={() => setEditorState("editRecipe")}
          onSave={(data: RecipeInstructions[]) => {
            setCurrentRecipe(() => {
              return { ...currentRecipe, recipeInstructions: data };
            });
            setEditorState("editRecipe");
          }}
        />
      </main>
    );
  } else
    return (
      <main className="flex relative h-full w-screen overflow-hidden flex-row items-start justify-start">
        {sidebarShown ? (
          <SideBar>
            <Tooltip
              content="Full screen"
              className="px-4 *:bg-white"
              placement="right"
              radius="sm"
            >
              <Button
                isIconOnly
                className="absolute -right-[48px] top-0"
                onPress={() => setSidebarShown(!sidebarShown)}
                color="primary"
                endContent={<MaximizeIcon stroke="white" />}
                radius="none"
                size="lg"
              />
            </Tooltip>
            {currentRecipe && editorState === "editRecipe" && (
              <>
                <div className="w-full flex flex-col gap-4 z-10 items-center justify-center">
                  <label
                    htmlFor="recipe-title"
                    className="font-league-spartan text-lg text-left w-full pl-2"
                  >
                    Recipe title:
                  </label>
                  <Input
                    type="text"
                    value={currentRecipe?.name?.toString()}
                    color="default"
                    radius="sm"
                    size="lg"
                    onChange={(e) => {
                      setCurrentRecipe(() => {
                        return {
                          ...currentRecipe,
                          name: e.target.value,
                        };
                      });
                    }}
                    className="w-full"
                    name="recipe-title"
                  />
                  <Button
                    className="sm:hidden font-league-spartan text-lg text-white w-full px-4"
                    onPress={() => setSidebarShown(!sidebarShown)}
                    endContent={<MaximizeIcon stroke="white" />}
                    radius="none"
                    variant="flat"
                    size="lg"
                  >
                    View recipe
                  </Button>
                </div>
                <div className="w-full flex flex-col gap-4 z-10 items-center justify-center">
                  <p className="font-league-spartan text-lg text-left w-full pl-2">
                    Recipe details:
                  </p>
                  <Button
                    className="font-league-spartan text-lg text-white w-full px-4"
                    onClick={() => setEditorState("recipeIngredient")}
                    size="lg"
                    color="primary"
                    radius="sm"
                    variant="solid"
                    endContent={<EditIcon fill="white" />}
                  >
                    Edit ingredients
                  </Button>
                  <Button
                    className="font-league-spartan text-lg text-white w-full px-4"
                    onClick={() => setEditorState("recipeInstructions")}
                    size="lg"
                    color="primary"
                    radius="sm"
                    variant="solid"
                    endContent={<EditIcon fill="white" />}
                  >
                    Edit steps
                  </Button>
                  <Button
                    className="font-league-spartan text-lg text-white w-full px-4"
                    onClick={() => {
                      handleDeleteRecipe(currentRecipe.id as number);
                      router.push("/myrecipes");
                    }}
                    size="md"
                    color="danger"
                    radius="sm"
                    variant="solid"
                    endContent={<CloseCircleIcon stroke="white" />}
                  >
                    Delete recipe
                  </Button>
                </div>
                <div className="mt-auto flex w-full justify-between between gap-1">
                  <Button
                    className="font-league-spartan text-lg text-white px-4 2xl:w-1/2"
                    onClick={() => handleUpdateRecipe()}
                    size="lg"
                    color="success"
                    radius="sm"
                    variant="solid"
                    endContent={
                      <SaveIcon stroke="rgb(34 197 94)" fill="white" />
                    }
                  >
                    Save changes
                  </Button>
                  <Button
                    className="font-league-spartan text-lg px-4 w-2/8 2xl:w-1/2"
                    onClick={() => {
                      setCurrentRecipe(initialRecipe);
                      router.push(`/myrecipes/${currentRecipe.id}`);
                    }}
                    size="lg"
                    color="danger"
                    radius="sm"
                    variant="flat"
                    endContent={<CloseCircleIcon stroke="red" />}
                  >
                    Discard
                  </Button>
                </div>
              </>
            )}
          </SideBar>
        ) : (
          <></>
        )}
        <section className="fixed md:relative flex flex-col h-full w-full p-0 overflow-hidden">
          <div className="absolute flex flex-col items-start top-0 h-12 w-full">
            {sidebarShown ? (
              <></>
            ) : (
              <Button
                onPress={() => setSidebarShown(!sidebarShown)}
                className="text-base"
                color="primary"
                endContent={<ArrowRightIcon stroke="white" fill="white" />}
                radius="none"
                size="lg"
              >
                Show sidebar
              </Button>
            )}
          </div>
          <div className="pt-8 overflow-y-auto">
            <RecipeViewer
              recipe={currentRecipe}
              emptyText="No recipe loaded. Choose a recipe and it will show up here!"
            />
          </div>
        </section>
      </main>
    );
}
