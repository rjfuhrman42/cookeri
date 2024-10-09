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
        const parsedRecipeData = parseRecipeDataFromHtml(recipeDocument);
        return setData(parsedRecipeData);
      }

      // Search for the Recipe @type and parse it
      const json = JSON.parse(json_ld_element?.innerHTML);

      // If the recipe data just exists as the first element on the json-ld, use that
      // Else, if the json-ld has a @graph property, check for @type of "Recipe"
      // This tells us whether there is recipe meta data
      if (
        json[0] ||
        (json["@graph"] &&
          json["@graph"].some((item: any) => item["@type"] === "Recipe"))
      ) {
        const recipeMetaData: Recipe =
          !json["@graph"] && json[0]
            ? json[0]
            : json["@graph"].filter((item: any) => {
                if (item["@type"] === "Recipe") {
                  return item;
                }
              })[0];

        // Parse the recipe data from the JSON-LD
        const processedRecipeData = parseRecipeDataFromJsonLd(recipeMetaData);
        return setData(processedRecipeData);
      } else {
        console.log("here!!");
        // If there is JSON-LD but no recipe data is present, parse the recipe manually
        const processedRecipeData = parseRecipeDataFromHtml(recipeDocument);
        console.log("hi!", processedRecipeData);
        return setData(processedRecipeData);
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

  function parseRecipeDataFromHtml(recipeDocument: Document) {
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
    const images = recipeDocument.body.querySelectorAll("img");
    images.forEach((img: HTMLImageElement) => console.log(img.src));

    let recipeYield = null;

    const allNodes = recipeDocument.querySelectorAll("*");
    allNodes.forEach((node: Element) => {
      if (!node.textContent) return;

      const textContent = node.textContent.toLowerCase();
      const result = textContent.match(
        /(?:yields|yield|serves|servings|makes):* (.*$)/
      );

      if (result !== null && result[1] !== "" && result[1].length < 30) {
        recipeYield = result[1];
      } else {
        console.log("no serving information found");
      }
    });

    let highIngredientNode: { node: undefined | Element; score: number } = {
      node: undefined,
      score: 0,
    };

    let highInstructionNode: { node: undefined | Element; score: number } = {
      node: undefined,
      score: 0,
    };

    allNodes.forEach((node) => {
      if (!node || !node.textContent) return;

      const ingredientScore = scoreForIngredients(node.textContent);
      const instructionScore = scoreForInstructions(node.textContent);

      if (ingredientScore >= highIngredientNode.score) {
        highIngredientNode = { node, score: ingredientScore };
      }
      if (instructionScore >= highInstructionNode.score) {
        highInstructionNode = { node: node, score: instructionScore };
      }
    });

    // No nodes found, return
    if (!highIngredientNode.node || !highInstructionNode.node) return;

    console.log(
      highIngredientNode.node.childNodes.length > 1 &&
        highIngredientNode.node.childNodes
    );

    const lca = findLowestCommonAncestor(
      highIngredientNode.node,
      highInstructionNode.node
    );

    if (!lca) return;

    const lcaChildren = lca.querySelectorAll("*");

    /** 
      Traverse the nodes to see if they,
          1. Belong in the ingredients block
          2. Belong in the instructions block
          3. Should be ignored
      All nodes before the first ingredient node should be ignored.
    */
    console.log(highIngredientNode.node);
    if (highIngredientNode.node.childNodes.length > 1) {
      console.log(highIngredientNode.node);
    }

    const [finalIngredientsBlock, finalInstructionsBlock] =
      filterLcaForIngredients(highIngredientNode.node, lcaChildren);

    const processedRecipeData: SimpleRecipe = {
      url,
      name: recipeName as string,
      description: "",
      recipeYield: recipeYield ?? "",
      recipeIngredient: finalIngredientsBlock,
      recipeInstructions: [
        {
          name: "default",
          steps: finalInstructionsBlock,
        },
      ],
      image: images[0].src,
    };

    return processedRecipeData;
  }

  function filterLcaForIngredients(
    highScoringNode: Element,
    lcaChildren: NodeListOf<Element>
  ) {
    const ingredientsBlock: string[] = [];
    const instructionsBlock: string[] = [];

    let finishedIngredientBlock = false;
    let instructionClassName = "";

    for (const child of lcaChildren) {
      const nodeNameDoesNotMatch = child.nodeName !== highScoringNode.nodeName;

      if (!child.textContent || nodeNameDoesNotMatch) continue;

      const ingredientScore = scoreForIngredients(child.textContent);
      const instructionScore = scoreForInstructions(child.textContent);
      if (finishedIngredientBlock) {
        // Assume that instructions will all have the same class name
        // If the next child has a different className, we've found the end of the instructions block
        if (child.className !== instructionClassName) {
          break;
        }
        instructionsBlock.push(child.textContent);
        continue;
      }

      // If we have entered the ingredients block and we find an instruction node,
      // we're at the end of the ingredients block, leave the loop

      // If we haven't entered the ingredients block and we find a likely ingredient
      // add the node to the list, start of the ingredients block has been found

      if (ingredientsBlock.length === 0 && ingredientScore >= 3) {
        // Sometimes ingredients are written in one single HTML element (p, div, etc...), but are separated by <br>
        /*
          Example: 
          <p>
            750 gms leg of lamb diced (on the bone)<br>
            3 medium size onions<br>
            2 medium size tomatoes<br>
            ... 
          </p>

          as opposed to:
          <div>
            <p>750 gms leg of lamb diced (on the bone)</p>
            <p>3 medium size onions<</p>
            <p>2 medium size tomatoes</p>
          </div>
        */
        // The below if statement checks for this case
        if (child.childNodes.length > 1) {
          child.childNodes.forEach((node) => {
            if (node.nodeName === "#text" && node.textContent) {
              ingredientsBlock.push(node.textContent);
            }
          });
        } else ingredientsBlock.push(child.textContent);
        continue;
      }
      if (ingredientsBlock.length > 0) {
        // We're inside the ingredients block, so we're assuming every node is an ingredient

        if (instructionScore > ingredientScore) {
          instructionsBlock.push(child.textContent);
          // End of ingredients block
          // Start of instructions block
          finishedIngredientBlock = true;
          instructionClassName = child.className;
          continue;
        }

        ingredientsBlock.push(child.textContent);
      }
    }

    return [ingredientsBlock, instructionsBlock];
  }

  function findLowestCommonAncestor(node1: Element, node2: Element) {
    if (!node1 || !node2) return null;

    // Traverse up from node1
    let ancestor = node1;

    while (ancestor) {
      // Check if this ancestor contains node2
      if (ancestor.contains(node2)) {
        return ancestor;
      }
      ancestor = ancestor.parentNode as Element;
    }

    return null; // No common ancestor found
  }

  function scoreForInstructions(text: string) {
    let instructionScore = 0;

    const startsWithCaptialLetter = text.match(/^[A-Z]/g) !== null;
    const endsInPunctuation = text.match(/[\?\.!]$/g) !== null;
    const greaterThanOneHundredCharacters =
      text.length && text.length >= 100 && text.length <= 1000;
    const thereIsACaptialLetter = text.match(/[A-Z]/g) !== null;
    const instructionalWords = [
      "place",
      "sprinkle",
      "mix",
      "sautee",
      "sauté",
      "chop",
      "wash",
      "boil",
      "soak",
      "combine",
      "prepare",
    ];

    // If the text is within the "normal" character range, increase the score for each word it contains
    instructionalWords.forEach((word) => {
      if (
        text.toLowerCase().includes(word) &&
        greaterThanOneHundredCharacters
      ) {
        instructionScore += 1;
      }
    });

    if (startsWithCaptialLetter) {
      instructionScore += 1;
    }
    if (endsInPunctuation) {
      instructionScore += 1;
    }
    if (greaterThanOneHundredCharacters) {
      instructionScore += 1;
    }
    if (thereIsACaptialLetter) {
      instructionScore += 1;
    }

    return instructionScore;
  }

  function scoreForIngredients(text: string) {
    let ingredientScore = 0;

    const startsWithNumber = text.match(/^[1-9\u00BD-\u2152]/g) !== null;
    const lessThanOneHundredCharacters = text.length && text.length < 100;
    // Array of words commonly found used in ingredients
    const commonIngredientWords = [
      "olive oil",
      "butter",
      "salt",
      "oil",
      "pepper",
      "parsley",
    ];
    const commonUnitWords = [
      "cup",
      "cups",
      "lb",
      "oz",
      "tbsp",
      "tsp",
      "teaspoon",
      "tablespoon",
      "pinch",
      "grams",
      "gms",
      "g ",
      "piece",
      "to taste",
      "sprig",
      "handful",
    ];

    const hasCommonIngredientWords = commonIngredientWords.some((word) =>
      text.toLowerCase().includes(word)
    );

    const hasCommonUnitWords = commonUnitWords.some((word) =>
      text.toLowerCase().includes(word)
    );

    if (startsWithNumber) {
      ingredientScore += 1;
    }
    if (lessThanOneHundredCharacters) {
      ingredientScore += 1;
    }
    if (hasCommonIngredientWords) {
      ingredientScore += 1;
    }
    if (hasCommonUnitWords) {
      ingredientScore += 1;
    }

    return ingredientScore;
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
