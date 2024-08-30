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

      const recipeDocument = parser.parseFromString(data, "text/html");
      const json_ld_element = recipeDocument.querySelector(
        'script[type="application/ld+json"]'
      );

      /** ---- Make a manual parse function ----------------------------
        Check for the presence of JSON-LD
        If no JSON-LD, call manual parse to get the recipe
        If no recipe in JSON-LD, call manual parse to get the recipe
        Otherwise parse with JSON-LD 
      **/

      // If there is no JSON-LD, parse the recipe manually
      if (!json_ld_element) {
        parseRecipeDataFromHtml(data);
        return;
      }

      // Search for the Recipe @type and parse it
      const json = JSON.parse(json_ld_element?.innerHTML);

      const recipeMetaData: Recipe =
        !json["@graph"] && json[0]
          ? json[0]
          : json["@graph"].filter((item: any) => {
              if (item["@type"] === "Recipe") {
                return item;
              }
            })[0];

      if (recipeMetaData) {
        // Parse the recipe data from the JSON-LD
        const processedRecipeData = parseRecipeDataFromJsonLd(recipeMetaData);
        return setData(processedRecipeData);
      } else {
        // If there is JSON-LD but no recipe data is present, parse the recipe manually
        parseRecipeDataFromHtml(recipeDocument);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function parseRecipeDataFromJsonLd(recipeMetaData: Recipe) {
    const instructions = recipeMetaData?.recipeInstructions as RecipeSteps;

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

    const yieldArray = new Array(recipeMetaData.recipeYield)[0] as string[];
    const recipeYield = yieldArray[0];

    const recipeImage = recipeMetaData.image as
      | {
          "@type": ImageObject;
          height: number;
          url: string;
          width: number;
        }
      | string[];

    // Images come as an array of several images, or just one image object with a URL property
    const imageUrl: string = Array.isArray(recipeImage)
      ? recipeImage[0]
      : recipeImage.url;

    const processedRecipeData: SimpleRecipe = {
      url,
      name: recipeMetaData.name as string,
      description: recipeMetaData.description as string,
      prepTime: recipeMetaData.prepTime as string,
      cookTime: recipeMetaData.cookTime as string,
      totalTime: recipeMetaData.totalTime as string,
      recipeYield,
      recipeIngredient: recipeMetaData.recipeIngredient as string[],
      recipeInstructions: processedInstructions,
      image: imageUrl,
      author: recipeMetaData.author as string,
    };

    return processedRecipeData;
  }

  function parseRecipeDataFromHtml(recipeDocument: any) {
    // Advanced parsing here ...

    // First, get the title
    // 1. Check for the presence of an og:title title meta tag
    // 2. Else, just use the title tag
    const ogTitleElement: HTMLMetaElement | null = recipeDocument.querySelector(
      'meta[property="og:title"]'
    );
    const title = recipeDocument.querySelector("title")?.textContent;
    const recipeName = ogTitleElement?.content ?? title;
    console.log("recipe name -->", recipeName);

    // Get the images
    const images = recipeDocument.querySelectorAll("img");
    images.forEach((img: HTMLImageElement) => console.log(img.src));

    const allNodes = recipeDocument.querySelectorAll("*");
    allNodes.forEach((node: HTMLElement) => {
      if (
        node.textContent &&
        node.textContent.toLowerCase().includes("serves")
      ) {
        console.log("text", node.textContent.toLowerCase());
      }
    });
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
