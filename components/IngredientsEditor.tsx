"use client";

import { Button } from "@nextui-org/button";
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
    <div className="relative flex flex-col items-center py-16 px-8 w-full h-screen bg-light-grey">
      <div className="flex flex-row justify-between container max-w-[625px] gap-x-4">
        <h1 className="font-bold">Editing Ingredients</h1>
      </div>
      <Button
        className="absolute top-5 right-5 text-lg text-white px-4"
        onClick={() => onCancel()}
        size="lg"
        color="danger"
        radius="sm"
        endContent={
          <div className="pb-0.5">
            <CloseCircle fill="white" stroke="red" />
          </div>
        }
      >
        Discard
      </Button>
      <div className="w-[625px]">
        <textarea
          className="h-[400px] container p-4 my-8 bg-white"
          defaultValue={parseRecipeData()}
        ></textarea>
        <Button
          className="text-lg text-white px-4 w-full"
          onClick={() => {
            const data = document.querySelector("textarea")?.value;
            if (!data) return;
            saveRecipeData(data);
          }}
          size="lg"
          radius="sm"
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
    </div>
  );
}
