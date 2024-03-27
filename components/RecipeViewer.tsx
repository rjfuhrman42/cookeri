import Image from "next/image";
import React from "react";
import { Recipe, HowToStep, HowToSection } from "schema-dts";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);

type Props = {
  recipe: Recipe | undefined;
};

/*

    Todos:
    [] Handle when text contains character references like &#39; and &amp;
    [] Don't show properties that are not provided (Author, Prep, Cook, etc.)
    [] Consider adding a custom number icon for recipe steps

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

  const prep = dayjs.duration(prepTime as string).humanize();
  const cook = dayjs.duration(cookTime as string).humanize();
  const total = dayjs.duration(totalTime as string).humanize();

  return (
    <>
      {recipe ? (
        <div className="flex flex-col gap-y-12 pt-20 w-full lg:max-w-[875px]">
          <h1 className="text-3xl font-bold text-center">{name?.toString()}</h1>
          <div className="flex flex-col md:flex-row h-[400px]">
            <div className="bg-cookeri-green-light p-8 flex-1">
              <div className="flex flex-col pb-8 gap-y-2">
                {authorDetails?.name && (
                  <div className="flex flex-row">
                    <p className="font-bold mr-1">Author: </p>
                    <p>{authorDetails?.name}</p>
                  </div>
                )}
                <div className="flex flex-row gap-x-2">
                  <div className="flex flex-row">
                    <p className="font-bold mr-1">Prep: </p>
                    <p>{prep}</p>
                  </div>
                  <div className="flex flex-row">
                    <p className="font-bold mr-1">Cook: </p>
                    <p>{cook}</p>
                  </div>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold mr-1">Total: </p>
                  <p>{total}</p>
                </div>
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
          <div className="flex flex-col md:flex-row gap-x-8">
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl my-4 font-bold">Ingredients</h2>
              <ul>
                {ingredients?.map((ingredient, index) => (
                  <li className="py-2" key={index}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl my-4 font-bold">Steps</h2>
              {howToSteps && (
                <ol className="list-decimal ml-4" type="1">
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
                    <ol className="list-decimal ml-4" type="1">
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