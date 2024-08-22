import { HowToStep, ImageObject, Recipe } from "schema-dts";
import { Recipe as SimpleRecipe } from "../app/myrecipes/page";

import React from "react";
import { Button } from "@nextui-org/button";
import { ImportIcon } from "./icons";
import { Input } from "@nextui-org/input";
import { RecipeSteps } from "./StepsEditor";

interface Props {
  url: string;
  setUrl: (url: string) => void;
  setData: (data: SimpleRecipe | undefined) => void;
}

export type RecipeInstructions = {
  name: string;
  steps: string[];
  id?: number;
};

function ImportBar({ url, setUrl, setData }: Props) {
  /*

    Todos:
    [] Handle when calls to sites are blocked by firewall
    [] Handle when sites do not use JSON-LD 
    [] Better error handling (define what this means)
    [X]  Handle when sites do not follow expected pattern

  */

  async function importData() {
    if (url.length <= 0) return;
    setData(undefined);

    try {
      const res = await fetch(`/api/proxy?url=${url.trim()}`);
      const data = await res.text();

      const parser = new DOMParser();

      const temp_doc = parser.parseFromString(data, "text/html");
      const json_ld_element = temp_doc.querySelector(
        'script[type="application/ld+json"]'
      );

      /* TODO: Handle cases where there is no JSON-LD
         For now, skip over the JSON-LD parsing portion and return */
      console.log("json ld ", json_ld_element);
      if (json_ld_element === null) {
        return;
      }

      // Search for the Recipe @type and parse it
      const json = JSON.parse(json_ld_element?.innerHTML);

      // Check for the presence of a graph or an array
      // If there is a graph, we can parse the easy way and make use of the meta data
      // otherwise, we have to use the advanced parsing technique
      if (json["@graph"] || json[0]) {
        const recipeData: Recipe =
          !json["@graph"] && json[0]
            ? json[0]
            : json["@graph"].filter((item: any) => {
                if (item["@type"] === "Recipe") {
                  return item;
                }
              })[0];

        console.log("recipe data", recipeData, json);

        const instructions = recipeData?.recipeInstructions as RecipeSteps;

        // Check for an initial steps section - edge case OR when a recipe has no subsections
        const howToSteps = instructions?.filter((step) => {
          return step["@type"] === "HowToStep";
        });

        // Add an initial section, if it exists
        const processedInstructions: RecipeInstructions[] =
          howToSteps.length > 0
            ? [
                {
                  name: "default",
                  steps: howToSteps.map((step) => step.text as string),
                },
              ]
            : [];

        // Add the subsections
        instructions.forEach((step) => {
          if (step["@type"] === "HowToSection") {
            const howToSteps = step.itemListElement as HowToStep[];
            processedInstructions.push({
              name: step.name as string,
              steps: howToSteps.map((step) => step.text as string),
            });
          }
        });

        const yieldArray = new Array(recipeData.recipeYield)[0] as string[];
        const recipeYield = yieldArray[0];

        const recipeImage = recipeData.image as
          | { "@type": ImageObject; height: number; url: string; width: number }
          | string[];

        // Images come as an array of several images, or just one image object with a URL property
        const imageUrl: string = Array.isArray(recipeImage)
          ? recipeImage[0]
          : recipeImage.url;

        const processedRecipeData: SimpleRecipe = {
          url,
          name: recipeData.name as string,
          description: recipeData.description as string,
          prepTime: recipeData.prepTime as string,
          cookTime: recipeData.cookTime as string,
          totalTime: recipeData.totalTime as string,
          recipeYield,
          recipeIngredient: recipeData.recipeIngredient as string[],
          recipeInstructions: processedInstructions,
          image: imageUrl,
          author: recipeData.author as string,
        };

        setData(processedRecipeData);
      } else {
        // Advanced parsing here ...

        // Get the title
        const el: HTMLMetaElement | null = temp_doc.querySelector(
          'meta[property="og:title"]'
        );

        console.log("no json ld", el?.content);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className="w-full flex flex-col gap-8 z-10 items-center justify-center text-sm">
      <div className="w-full flex flex-col gap-4 z-10 items-center justify-center">
        <label
          htmlFor="recipe-import"
          className="font-league-spartan text-lg text-left w-full pl-2"
        >
          Import recipe from a website:
        </label>
        <Input
          type="url"
          value={url}
          color="default"
          size="lg"
          radius="sm"
          onChange={(e) => setUrl(e.target.value)}
          className="w-full"
          name="recipe-import"
        />
        <Button
          className="font-league-spartan text-lg text-white w-full px-4"
          onClick={() => importData()}
          size="md"
          color="primary"
          radius="sm"
          endContent={<ImportIcon stroke="white" />}
        >
          Import
        </Button>
      </div>
    </div>
  );
}

export default ImportBar;
