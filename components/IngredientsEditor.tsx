"use client";

import { Button } from "@nextui-org/button";
import { Recipe as RecipeJsonLd } from "schema-dts";
import CloseCircle from "./icons/CloseCircle";
import { TickCircleIcon } from "./icons";

interface Props {
  ingredients: string[];
  onSave: (data: string[]) => void;
  onCancel: () => void;
}

export default function IngredientsEditor({
  ingredients,
  onSave,
  onCancel,
}: Props) {
  function parseRecipeData() {
    return ingredients.join("\n");
  }

  function saveRecipeData(data: string) {
    const updatedIngredients = data.trim().split("\n");
    onSave(updatedIngredients);
  }

  return (
    <div className="relative flex flex-col items-center py-16 px-8 w-full h-screen">
      <div className="flex flex-row justify-between container max-w-[625px] gap-x-4">
        <h1>Edit Ingredients</h1>
        <Button
          className="text-lg text-white px-4"
          onClick={() => {
            const data = document.querySelector("textarea")?.value;
            if (!data) return;
            saveRecipeData(data);
          }}
          size="lg"
          color="success"
          endContent={
            <div className="pb-0.5">
              <TickCircleIcon stroke="white" />
            </div>
          }
        >
          Save edits
        </Button>
      </div>
      <Button
        className="absolute top-5 right-5 text-lg text-white px-4"
        isIconOnly
        onClick={() => onCancel()}
        size="lg"
        color="danger"
        endContent={
          <div className="pb-0.5">
            <CloseCircle fill="white" stroke="red" />
          </div>
        }
      />
      <textarea
        className="h-full container max-w-[625px] p-4 mt-4"
        defaultValue={parseRecipeData()}
      ></textarea>
    </div>
  );
}
