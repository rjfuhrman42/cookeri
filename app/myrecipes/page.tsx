"use client";

import { useEffect, useMemo, useState } from "react";

import SideBar from "@/components/SideBar";
import ImportBar, { RecipeInstructions } from "@/components/ImportBar";
import { Button } from "@nextui-org/button";
import RecipeViewer from "@/components/RecipeViewer";
import {
  CloseCircleIcon,
  EditIcon,
  MaximizeIcon,
  SaveIcon,
} from "@/components/icons";
import { Input } from "@nextui-org/input";
import IngredientsEditor from "@/components/IngredientsEditor";
import StepsEditor, { RecipeSteps } from "@/components/StepsEditor";
import { createClient } from "@/utils/supabase/client";
import { UserResponse } from "@supabase/supabase-js";
import { Link } from "@nextui-org/link";
import { Listbox, ListboxItem } from "@nextui-org/listbox";

export type Recipe = {
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  recipeYield: string;
  recipeIngredient: string[];
  recipeInstructions: RecipeInstructions[];
  image: string;
  author: string;
};

type editorStateType =
  | "recipeIngredient"
  | "recipeInstructions"
  | "myRecipes"
  | "editRecipe";

export default function MyRecipes() {
  const [editorState, setEditorState] = useState<editorStateType>("myRecipes");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | undefined>();
  const [recipes, setRecipes] = useState<any[] | undefined>();
  const [selectedKeys, setSelectedKeys] = useState(new Set(["text"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  useEffect(() => {
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

        const recipeInstructions = data.map((step: RecipeInstructions) => {
          return { name: step.name, steps: step.steps };
        });

        setCurrentRecipe({
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
        });
      });
  }, [selectedValue, recipes]);

  const supabase = createClient();

  async function fetchRecipe() {
    const { data, error } = await supabase.from("recipe").select("*");

    if (data) {
      setRecipes(data);
    }
  }

  useEffect(() => {
    fetchRecipe();
  }, []);

  async function handleSaveRecipe() {
    if (!currentRecipe) return;

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
        .insert({ ...payload, user_id: userData.data.user.id })
        .select();

      if (error) {
        console.error("error saving recipe", error.message);
        return;
      }

      if (!data) return;

      const { error: stepsError } = await supabase
        .from("recipe_instructions")
        .insert(
          currentRecipe.recipeInstructions.map((step) => ({
            ...step,
            recipe_id: data?.[0].id,
          }))
        );
      if (stepsError) {
        console.error("error saving steps", stepsError.message);
        return;
      }
    } catch (error) {
      console.error("error", error);
    }
  }

  if (editorState === "recipeIngredient" && currentRecipe?.recipeIngredient) {
    return (
      <main className="flex h-full w-screen overflow-hidden flex-row items-start justify-start">
        <IngredientsEditor
          ingredients={currentRecipe.recipeIngredient as string[]}
          onCancel={() => setEditorState("myRecipes")}
          onSave={(data: string[]) => {
            setCurrentRecipe(() => {
              return { ...currentRecipe, recipeIngredient: data };
            });
            setEditorState("myRecipes");
          }}
        />
      </main>
    );
  } else if (editorState === "recipeInstructions" && currentRecipe) {
    return (
      <main className="flex h-full w-screen overflow-hidden flex-row items-start justify-start">
        <StepsEditor
          steps={currentRecipe.recipeInstructions}
          onCancel={() => setEditorState("myRecipes")}
          onSave={(data: RecipeInstructions[]) => {
            setCurrentRecipe(() => {
              return { ...currentRecipe, recipeInstructions: data };
            });
            setEditorState("myRecipes");
          }}
        />
      </main>
    );
  } else
    return (
      <main className="flex h-full w-screen overflow-hidden flex-row items-start justify-start">
        <SideBar>
          {/* <ImportBar url={url} setUrl={setUrl} setData={setCurrentRecipe} /> */}

          {recipes && editorState === "myRecipes" ? (
            <>
              <h1>My recipes</h1>
              <Listbox
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) =>
                  setSelectedKeys(keys as Set<string>)
                }
              >
                {recipes.map((recipe, index) => {
                  return (
                    <ListboxItem className="bg-white" key={index}>
                      {recipe.name}
                    </ListboxItem>
                  );
                })}
              </Listbox>
            </>
          ) : (
            <></>
          )}
          {editorState === "myRecipes" && currentRecipe ? (
            <Button
              color="primary"
              onClick={() => setEditorState("editRecipe")}
            >
              Edit current recipe
            </Button>
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
                  color="success"
                  endContent={<EditIcon fill="white" />}
                >
                  Edit ingredients
                </Button>
                <Button
                  className="font-league-spartan text-lg text-white w-full px-4"
                  onClick={() => setEditorState("recipeInstructions")}
                  size="lg"
                  color="success"
                  endContent={<EditIcon fill="white" />}
                >
                  Edit steps
                </Button>
              </div>
              <Button
                className="mt-auto font-league-spartan text-lg text-white w-full px-4"
                onClick={() => handleSaveRecipe()}
                size="lg"
                color="success"
                endContent={<SaveIcon stroke="rgb(34 197 94)" fill="white" />}
              >
                Save recipe
              </Button>
              <Button
                className="mt-auto font-league-spartan text-lg text-white w-full px-4"
                onClick={() => setEditorState("myRecipes")}
                size="lg"
                color="danger"
                endContent={<CloseCircleIcon stroke="white" />}
              >
                Discard changes
              </Button>
            </>
          )}
          <Button
            className="mt-auto font-league-spartan text-lg text-white w-full px-4"
            as={Link}
            color="success"
            size="lg"
            href="/importrecipe"
          >
            Add a new recipe
          </Button>
        </SideBar>
        <section className=" relative flex flex-col h-full w-full p-0 overflow-hidden">
          <Button
            isIconOnly
            className="absolute top-2 left-2 text-white text-base"
            endContent={<MaximizeIcon stroke="white" />}
            size="lg"
            color="primary"
          />
          <RecipeViewer recipe={currentRecipe} />
        </section>
      </main>
    );
}
