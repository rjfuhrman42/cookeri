import Image from "next/image";
import React from "react";
import { Recipe, HowToStep, HowToSection } from "schema-dts";

type Props = {
  recipe: Recipe | undefined;
};

/*

    Todos for later:
    [] Handle when text contains character references like &#39; and &amp;

  */

function RecipeViewer({ recipe }: Props) {
  const {
    name,
    description,
    prepTime,
    cookTime,
    totalTime,
    recipeIngredient,
    recipeInstructions,
    image,
    author,
  } = recipe || {};

  console.log(recipe);

  const ingredients = recipeIngredient as string[];
  const instructions = recipeInstructions as HowToStep[] | HowToSection[];
  const howToSteps = instructions?.filter(
    (step) => step["@type"] === "HowToStep"
  );
  const howToSections = instructions?.filter(
    (step) => step["@type"] === "HowToSection"
  );
  const images = image as string[];

  const authorDetails = author as { name: string } | undefined;

  console.log(Date.parse(prepTime as string));

  return (
    <>
      {recipe ? (
        <div className="pt-20 max-w-[875px]">
          <h1 className="text-3xl my-4">{name?.toString()}</h1>
          <div className="flex flex-row h-[400px]">
            <div className="bg-cookeri-green-light p-8 flex-1">
              <div className="pb-12">
                <h3 className="">Author: {authorDetails?.name}</h3>
                <h3 className="">Prep: {prepTime}</h3>
                <h3 className="">Cook: {cookTime}</h3>
                <h3 className="">Total: {totalTime}</h3>
              </div>
              <p>{description?.toString()}</p>
            </div>
            {images && (
              <div className="relative flex-1 bg-red-500 overflow-hidden">
                <Image
                  src={images[0]}
                  fill
                  alt={name?.toString() || "Recipe Image Not Provided"}
                  className="object-cover object-center"
                />
              </div>
            )}
          </div>
          <div className="flex flex-row gap-x-8">
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl my-4 font-bold">Ingredients</h2>
              <ul>
                {ingredients?.map((ingredient, index) => (
                  <li className="py-1" key={index}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl my-4 font-bold">Steps</h2>
              {howToSteps && (
                <ol className="list-decimal" type="1">
                  {howToSteps?.map((step, index) => {
                    return (
                      <li className="py-2" key={index}>
                        {String(step.text)}
                      </li>
                    );
                  })}
                </ol>
              )}
              {howToSections?.map((section, index) => {
                const itemArray = section.itemListElement as HowToStep[];
                return (
                  <div key={index}>
                    <h3 className="text-lg my-4 font-medium">
                      {String(section.name)}
                    </h3>
                    <ol className="list-decimal" type="1">
                      {itemArray.map((item, index) => {
                        return (
                          <li className="py-2" key={index}>
                            {String(item.text)}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-20">
          No recipe right now! Import a recipe and it will show up here...
        </div>
      )}
    </>
  );
}

export default RecipeViewer;
