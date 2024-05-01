"use client";

import { useState } from "react";
import { Recipe as RecipeJsonLd } from "schema-dts";

import SideBar from "@/components/SideBar";
import ImportBar from "@/components/ImportBar";
import { Button } from "@nextui-org/button";
import RecipeViewer from "@/components/RecipeViewer";
import { EditIcon, MaximizeIcon, SaveIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import IngredientsEditor from "@/components/IngredientsEditor";
import StepsEditor, { RecipeSteps } from "@/components/StepsEditor";

export default function DashBoard() {
  const [url, setUrl] = useState("");
  const [editorState, setEditorState] = useState<
    "recipeIngredient" | "recipeInstructions" | ""
  >("");
  const [currentRecipe, setCurrentRecipe] = useState<
    RecipeJsonLd | undefined
  >();

  if (editorState === "recipeIngredient" && currentRecipe?.recipeIngredient) {
    return (
      <main className="flex h-full w-screen overflow-hidden flex-row items-start justify-start">
        <IngredientsEditor
          ingredients={currentRecipe.recipeIngredient as string[]}
          onCancel={() => setEditorState("")}
          onSave={(data: string[]) => {
            setCurrentRecipe((prev) => {
              return { ...prev, recipeIngredient: data, "@type": "Recipe" };
            });
            setEditorState("");
          }}
        />
      </main>
    );
  } else if (editorState === "recipeInstructions" && currentRecipe) {
    return (
      <main className="flex h-full w-screen overflow-hidden flex-row items-start justify-start">
        <StepsEditor
          steps={currentRecipe.recipeInstructions as RecipeSteps}
          onCancel={() => setEditorState("")}
          onSave={(data: RecipeSteps) => {
            setCurrentRecipe((prev) => {
              return { ...prev, recipeInstructions: data, "@type": "Recipe" };
            });
            setEditorState("");
          }}
        />
      </main>
    );
  } else
    return (
      <main className="flex h-full w-screen overflow-hidden flex-row items-start justify-start">
        <SideBar>
          <ImportBar url={url} setUrl={setUrl} setData={setCurrentRecipe} />
          {currentRecipe && (
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
                    setCurrentRecipe((prev) => {
                      return {
                        ...prev,
                        name: e.target.value,
                        "@type": "Recipe",
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
                onClick={() => {}}
                size="lg"
                color="success"
                endContent={<SaveIcon stroke="rgb(34 197 94)" fill="white" />}
              >
                Save recipe
              </Button>
            </>
          )}
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
