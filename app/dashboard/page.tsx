"use client";

import ImportBar from "@/components/ImportBar";
import RecipeViewer from "@/components/RecipeViewer";
import SideBar from "@/components/SideBar";
import { useState } from "react";
import { Recipe } from "schema-dts";

export default function DashBoard() {
  const [url, setUrl] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | undefined>();

  return (
    <main className="flex h-screen w-screen overflow-hidden flex-row items-start justify-start">
      <SideBar>
        <ImportBar url={url} setUrl={setUrl} setData={setCurrentRecipe} />
      </SideBar>
      <RecipeViewer recipe={currentRecipe} />
    </main>
  );
}
