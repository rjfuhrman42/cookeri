"use client";

import { Button } from "@nextui-org/button";
import { HowToSection, HowToStep } from "schema-dts";
import CloseCircle from "./icons/CloseCircle";
import { TickCircleIcon } from "./icons";
import { useEffect, useMemo, useState } from "react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { RecipeInstructions } from "./ImportBar";

export type RecipeSteps = HowToStep[] | HowToSection[];

interface Props {
  steps: RecipeInstructions[];
  onSave: (data: RecipeInstructions[]) => void;
  onCancel: () => void;
}

export default function StepsEditor({ steps, onSave, onCancel }: Props) {
  const [stepsData, setStepsData] = useState<{
    [key: string]: string;
  }>({ Steps: "" });

  const [selectedKeys, setSelectedKeys] = useState(
    new Set([Object.keys(stepsData)[0]])
  );

  useEffect(() => {
    const data: { [key: string]: string } = {};
    const parseRecipeData = (data: string[]): string => {
      if (!data) return "";
      const arr = data.map((step) => {
        return String(step);
      });

      return arr.join("\n\n");
    };

    steps.forEach((step) => {
      const section = parseRecipeData(step.steps);
      data[`${step.name}`] = section;
    });

    setStepsData(data);
    setSelectedKeys(new Set([Object.keys(data)[0]]));
  }, [steps]);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  function saveRecipeData() {
    if (!stepsData) return;
    const updatedInstructions = [];

    for (const [key, value] of Object.entries(stepsData)) {
      const section = {
        name: key,
        steps: value
          .trim()
          .split("\n\n")
          .filter((step) => step !== "")
          .map((step) => step.trim()),
        id: steps.find((step) => step.name === key)?.id,
      } as RecipeInstructions;

      updatedInstructions.push(section);
    }

    onSave(updatedInstructions as RecipeInstructions[]);
  }

  return (
    <div className="relative flex flex-col items-center pt-8 pb-16 px-8 w-full h-screen bg-light-grey">
      <h1 className="pt-4 pb-12 font-bold">Edit Instructions</h1>
      <div className="flex flex-row justify-end container w-[825px] gap-x-4">
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
      </div>

      <div className="pt-4 flex flex-col h-full max-w-[825px] container relative">
        <div className="flex flex-row">
          <Listbox
            className="w-1/4"
            aria-label="Single selection example"
            variant="solid"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
          >
            {Object.keys(stepsData).map((key) => {
              return (
                <ListboxItem className="bg-white" key={key}>
                  {key}
                </ListboxItem>
              );
            })}
          </Listbox>
          <textarea
            className="h-[300px] container w-7/8 p-4 my-8 mt-1"
            value={stepsData[selectedValue]}
            onChange={(e) => {
              setStepsData((prev) => {
                return {
                  ...prev,
                  [selectedValue]: e.target.value,
                };
              });
            }}
          ></textarea>
        </div>
        <Button
          className="text-lg text-white px-4 w-full mb-2"
          onClick={() => {
            saveRecipeData();
          }}
          size="md"
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
          size="md"
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
