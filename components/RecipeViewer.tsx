import React from "react";
import { Recipe, HowToStep } from "schema-dts";

type Props = {
  recipe: Recipe | undefined;
};

function RecipeViewer({ recipe }: Props) {
  const {
    name,
    description,
    recipeIngredient,
    recipeInstructions,
    image: images,
    author,
  } = recipe || {};

  const ingredients = recipeIngredient as string[];
  const instructions = recipeInstructions as HowToStep[];

  const authorDetails = author as { name: string } | undefined;

  return (
    <>
      {recipe ? (
        <div className="pt-20 container">
          <h1 className="text-3xl my-4">{name?.toString()}</h1>
          <div className="flex flex-row gap-x-4">
            <div>
              <h3>Author: {authorDetails?.name}</h3>
              <p>{description?.toString()}</p>
            </div>
            <img
              src={images[0]?.toString()}
              alt={name?.toString()}
              className="my-4 w-1/3 object-contain"
            />
          </div>
          <div className="flex flex-row gap-x-8">
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl my-4">Ingredients</h2>
              <ul>
                {ingredients?.map((ingredient, index) => (
                  <li className="py-1" key={index}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl my-4">Steps</h2>
              <ol className="list-decimal" type="1">
                {instructions?.map((step, index) => (
                  <li className="py-2" key={index}>
                    {String(step.text)}
                  </li>
                ))}
              </ol>
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
