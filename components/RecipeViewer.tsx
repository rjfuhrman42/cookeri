import React from "react";
import { Recipe, HowToStep } from "schema-dts";

type Props = {
  recipe: Recipe | undefined;
};

function RecipeViewer({ recipe }: Props) {
  const { name, description, recipeIngredient, recipeInstructions } =
    recipe || {};

  const ingredients = recipeIngredient as string[];
  const instructions = recipeInstructions as HowToStep[];

  return (
    <>
      {recipe ? (
        <div className="pt-20">
          <h1 className="text-3xl my-4">{name?.toString()}</h1>
          <p>{description?.toString()}</p>
          <div className="flex flex-row gap-x-8">
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl my-4">Ingredients</h2>
              <ul>
                {ingredients?.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl my-4">Steps</h2>
              <ol className="list-decimal" type="1">
                {instructions?.map((step, index) => (
                  <li key={index}>{String(step.text)}</li>
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
