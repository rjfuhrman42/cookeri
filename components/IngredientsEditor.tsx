"use client";

import { Button } from "@heroui/button";
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
    <div className="relative flex flex-col h-full items-center py-16 px-8 w-full bg-light-grey">
      <div className="flex flex-row justify-center container gap-x-4">
        <h1 className="font-bold">Editing Ingredients</h1>
      </div>
      <Button
        className="hidden sm:flex absolute top-5 right-5 text-lg text-white px-4"
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
      <div className="flex flex-col flex-1 justify-between container max-w-[625px]">
        <textarea
          className="flex-1 container p-4 my-8 bg-white"
          defaultValue={parseRecipeData()}
        ></textarea>
        <Button
          className="text-lg text-white px-4 w-full mb-4"
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
        <Button
          className="sm:hidden text-lg text-white px-4"
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
      </div>
    </div>
  );
}
