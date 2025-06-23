"use client";
import { useState } from "react";

import SideBar from "@/components/SideBar";
import { RecipeInstructions } from "@/components/ImportBar";
import { Button } from "@heroui/button";
import RecipeViewer from "@/components/RecipeViewer";
import {
  ArrowRightIcon,
  CloseCircleIcon,
  EditIcon,
  MaximizeIcon,
  SaveIcon,
} from "@/components/icons";
import { Input } from "@heroui/input";
import IngredientsEditor from "@/components/IngredientsEditor";
import StepsEditor from "@/components/StepsEditor";
import { createClient } from "@/utils/supabase/client";
import { UserResponse } from "@supabase/supabase-js";

import { Tooltip } from "@heroui/tooltip";

import React from "react";
import { useRouter } from "next/navigation";
import { Recipe } from "../editrecipe/page";

type editorStateType = "recipeIngredient" | "recipeInstructions" | "editRecipe";

export default function CreateRecipe() {
  const [editorState, setEditorState] = useState<editorStateType>("editRecipe");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | undefined>({
    url: "",
    name: "",
    description: "",
    prepTime: "",
    cookTime: "",
    totalTime: "",
    recipeYield: "",
    recipeIngredient: [""],
    recipeInstructions: [],
    image: "",
    author: "",
    id: undefined,
  });

  const [sidebarShown, setSidebarShown] = useState(true);

  const router = useRouter();

  const supabase = createClient();

  async function handleSaveRecipe() {
    if (!currentRecipe) return;

    const userData: UserResponse = await supabase.auth.getUser();
    if (!userData?.data?.user) return;

    const payload = {
      url: currentRecipe.url,
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
        .insert({ ...payload, user_id: userData.data.user.id })
        .select();

      if (error) {
        console.error("error saving recipe", error.message);
        return;
      }

      if (!data) return;
      // console.log("new recipe id", data?.[0].id);
      const { error: stepsError } = await supabase
        .from("recipe_instructions")
        .insert(
          currentRecipe.recipeInstructions.map((step) => {
            console.log(data?.[0].id, step);
            return {
              ...step,
              recipe_id: data?.[0].id,
            };
          })
        );
      if (stepsError) {
        console.error("error saving steps:", stepsError.message);
        return;
      }
      // If the save was successful, redirect to the user's recipes page
      router.push("/myrecipes");
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
            console.log("data saved", data);
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
            {editorState === "editRecipe" && (
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
                        if (!currentRecipe) return;
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
                    onPress={() => setEditorState("recipeIngredient")}
                    size="lg"
                    color="primary"
                    radius="sm"
                    variant="solid"
                    endContent={<EditIcon fill="white" />}
                  >
                    Add ingredients
                  </Button>
                  <Button
                    className="font-league-spartan text-lg text-white w-full px-4"
                    onPress={() => setEditorState("recipeInstructions")}
                    size="lg"
                    color="primary"
                    radius="sm"
                    variant="solid"
                    endContent={<EditIcon fill="white" />}
                  >
                    Add steps
                  </Button>
                </div>
                <div className="mt-auto flex w-full justify-between between gap-1">
                  <Button
                    className="font-league-spartan text-lg text-white px-4 2xl:w-1/2"
                    onPress={() => handleSaveRecipe()}
                    size="lg"
                    color="success"
                    radius="sm"
                    variant="solid"
                    endContent={
                      <SaveIcon stroke="rgb(34 197 94)" fill="white" />
                    }
                  >
                    Save recipe
                  </Button>
                  <Button
                    className="font-league-spartan text-lg px-4 w-2/8 2xl:w-1/2"
                    onPress={() => {
                      router.push(`/myrecipes`);
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
