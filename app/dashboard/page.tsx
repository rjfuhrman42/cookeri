"use client";

import Maximize from "@/components/icons/Maximize";
import ImportBar from "@/components/ImportBar";
import RecipeViewer from "@/components/RecipeViewer";
import SideBar from "@/components/SideBar";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { Recipe as RecipeJsonLd } from "schema-dts";

export default function DashBoard() {
  const [url, setUrl] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState<
    RecipeJsonLd | undefined
  >();

  return (
    <main className="flex h-screen w-screen overflow-hidden flex-row items-start justify-start">
      <SideBar recipe={currentRecipe} setData={setCurrentRecipe}>
        <ImportBar url={url} setUrl={setUrl} setData={setCurrentRecipe} />
      </SideBar>
      <section className=" relative flex flex-col h-full w-full p-0 overflow-hidden">
        <Button
          isIconOnly
          className="absolute top-2 left-2 text-white text-base"
          endContent={<Maximize stroke="white" />}
          size="lg"
          color="primary"
        />
        <RecipeViewer recipe={currentRecipe} />
      </section>
    </main>
  );
}
