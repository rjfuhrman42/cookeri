"use client";

import { Button, ButtonGroup } from "@nextui-org/button";
import { HowToSection, HowToStep, Recipe as RecipeJsonLd } from "schema-dts";
import CloseCircle from "./icons/CloseCircle";
import { TickCircleIcon } from "./icons";
import { useEffect, useMemo, useState } from "react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";

export type RecipeSteps = HowToStep[] | HowToSection[];

interface Props {
  steps: RecipeSteps;
  onSave: (data: RecipeSteps) => void;
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
    const parseRecipeData = (data: HowToStep[]): string => {
      if (!data) return "";
      const arr = data.map((step) => {
        return String(step.text);
      });

      return arr.join("\n\n");
    };

    steps.forEach((step) => {
      if (step["@type"] === "HowToSection") {
        const section = parseRecipeData(step.itemListElement as HowToStep[]);
        data[`${step.name}`] = section;
      } else {
        data["Steps"] = parseRecipeData(steps as HowToStep[]);
      }
    });

    setStepsData(data);
    setSelectedKeys(new Set([Object.keys(data)[0]]));
  }, [steps]);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  function saveRecipeData(data: string) {
    const updatedInstructions = [];

    for (let [key, value] of Object.entries(stepsData)) {
      if (key === "Steps") {
        const inst = value.split("\n\n").map((step) => {
          return { "@type": "HowToStep", text: step.trim() } as HowToStep;
        });
        updatedInstructions.push(...inst);
      } else {
        const section = {
          "@type": "HowToSection",
          name: key,
          itemListElement: value.split("\n\n").map((step) => {
            return { "@type": "HowToStep", text: step.trim() };
          }),
        } as HowToSection;
        updatedInstructions.push(section);
      }
    }
    console.log(updatedInstructions);
    onSave(updatedInstructions as RecipeSteps);
  }

  return (
    <div className="relative flex flex-col items-center pt-8 pb-16 px-8 w-full h-screen">
      <h1 className="pt-4 pb-12 font-bold">Edit Instructions</h1>
      <div className="flex flex-row justify-end container w-[825px] gap-x-4">
        <Button
          className="text-lg text-white px-4"
          onClick={() => {
            const data = document.querySelector("textarea")?.value;
            if (!data) return;
            saveRecipeData(data);
          }}
          size="md"
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
          className="text-lg text-white px-4"
          onClick={() => onCancel()}
          size="md"
          color="danger"
          endContent={
            <div className="pb-0.5">
              <CloseCircle fill="white" stroke="red" />
            </div>
          }
        >
          Cancel
        </Button>
      </div>

      <div className="pt-4 flex flex-row justify-end h-full w-[825px] container">
        <Listbox
          className="w-1/4"
          aria-label="Single selection example"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
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
          className="h-full container w-7/8 p-4 mt-1"
          value={stepsData[selectedValue]}
          onChange={(e) => {
            setStepsData((prev) => {
              return {
                ...prev,
                [selectedValue]: e.target.value,
              };
            });
          }}
          defaultValue={""}
        ></textarea>
      </div>
    </div>
  );
}
