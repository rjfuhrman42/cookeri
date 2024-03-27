"use client";

import ImportBar from "@/components/ImportBar";
import RecipeViewer from "@/components/RecipeViewer";
import { useState } from "react";
import { Recipe } from "schema-dts";

export default function DashBoard() {
  const [url, setUrl] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | undefined>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-24">
      <ImportBar url={url} setUrl={setUrl} setData={setCurrentRecipe} />
      <RecipeViewer recipe={currentRecipe} />
    </main>
  );
}
