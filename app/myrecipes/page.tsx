"use client";

import { useEffect, useState } from "react";

import SideBar from "@/components/SideBar";
import { RecipeInstructions } from "@/components/ImportBar";
import { Button } from "@nextui-org/button";
import RecipeViewer from "@/components/RecipeViewer";
import {
  ArrowRightIcon,
  BookSquareIcon,
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
import { Link } from "@nextui-org/link";
import { Tooltip } from "@nextui-org/tooltip";
import RecipesList from "@/components/RecipesList";
import React from "react";

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

type editorStateType =
  | "recipeIngredient"
  | "recipeInstructions"
  | "myRecipes"
  | "editRecipe";

export default function MyRecipes() {
  const [editorState, setEditorState] = useState<editorStateType>("myRecipes");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | undefined>();
  const [initialRecipe, setInitialRecipe] = useState<Recipe | undefined>();
  const [recipes, setRecipes] = useState<any[] | undefined>();

  const [sidebarShown, setSidebarShown] = useState(true);

  const supabase = createClient();

  /* ------- Fetch recipes ------- */
  useEffect(() => {
    if (editorState !== "myRecipes") return;
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
  }, [supabase, editorState]);

  /* ------- Fetch recipe instructions ------- */

  function fetchRecipeData(selectedValue: string) {
    if (!recipes) return;

    const index = Number.parseInt(selectedValue);
    const recipe = recipes[index];

    if (!recipe) return;

    supabase
      .from("recipe_instructions")
      .select()
      .eq("recipe_id", recipe.id)
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

        setCurrentRecipe(parsedRecipe);

        // Save the initial recipe to compare changes
        // Use this to revert changes if needed
        setInitialRecipe(parsedRecipe);
      });
  }

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
      setEditorState("myRecipes");
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
      setEditorState("myRecipes");
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
      <main className="flex h-full w-screen overflow-hidden flex-row items-start justify-start">
        {sidebarShown ? (
          <SideBar>
            <Tooltip
              content="Full screen"
              className="px-4 bg-white"
              placement="right"
              radius="sm"
            >
              <Button
                isIconOnly
                onPress={() => setSidebarShown(!sidebarShown)}
                color="primary"
                endContent={<MaximizeIcon stroke="white" />}
                radius="none"
                size="lg"
              />
            </Tooltip>
            {editorState === "myRecipes" ? (
              <>
                <div className="flex items-center">
                  <BookSquareIcon className="mb-1.5" stroke="white" />
                  <h1 className="font-bold pl-4 text-white text-3xl">
                    My recipes
                  </h1>
                </div>
                <div className="bg-light-black text-white flex-1 w-full max-h-[450px] overflow-scroll">
                  {recipes ? (
                    <RecipesList
                      recipes={recipes}
                      onRecipeChange={(value) => fetchRecipeData(value)}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

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
                      setEditorState("myRecipes");
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
            {editorState === "myRecipes" && (
              <div className="mt-auto flex flex-col gap-y-4">
                <Button
                  className="font-league-spartan text-lg text-white w-full px-4"
                  color="primary"
                  isDisabled={!currentRecipe}
                  size="lg"
                  radius="sm"
                  variant="solid"
                  onClick={() => setEditorState("editRecipe")}
                >
                  Edit current recipe
                </Button>

                <Button
                  className="font-league-spartan text-lg text-white w-full px-4"
                  as={Link}
                  color="secondary"
                  size="lg"
                  radius="sm"
                  variant="solid"
                  href="/importrecipe"
                >
                  Add a new recipe
                </Button>
              </div>
            )}
          </SideBar>
        ) : (
          <></>
        )}
        <section className="relative flex flex-col h-full w-full p-0 overflow-hidden">
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
          <RecipeViewer
            recipe={currentRecipe}
            emptyText="No recipe loaded. Choose a recipe and it will show up here!"
          />
        </section>
      </main>
    );
}
