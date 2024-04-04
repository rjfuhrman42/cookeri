import { Button } from "@nextui-org/button";
import React, { useEffect, useState } from "react";
import { EditIcon, SaveIcon } from "./icons";

import { Input } from "@nextui-org/input";

import { Recipe } from "schema-dts";

interface Props {
  children: React.ReactNode;
  recipe?: Recipe | undefined;
  setData: (data: Recipe) => void;
}

function SideBar({ children, recipe, setData }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col h-lvh gap-y-8 w-[350px] 2xl:w-[450px] p-6 2xl:p-8">
        <h1 className="font-gluten mb-8 text-6xl text-center font-bold text-cookeri-green">
          Cookeri
        </h1>
        {children}
        <div className=" w-full flex flex-col gap-4 z-10 items-center justify-center">
          <label
            htmlFor="recipe-title"
            className="font-league-spartan text-lg text-left w-full pl-2"
          >
            Recipe title:
          </label>
          <Input
            type="text"
            value={recipe?.name?.toString()}
            color="default"
            size="lg"
            onChange={(e) => {
              setData({ ...recipe, name: e.target.value, "@type": "Recipe" });
            }}
            className="w-full"
            name="recipe-title"
          />
        </div>
        <div className="w-full flex flex-col gap-4 z-10 items-center justify-center">
          <p className="font-league-spartan text-lg text-left w-full pl-2">
            Recipe details:
          </p>
          <Button
            className="font-league-spartan text-lg text-white w-full px-4"
            onClick={() => {}}
            size="lg"
            color="success"
            endContent={<EditIcon fill="white" />}
          >
            Edit ingredients
          </Button>
          <Button
            className="font-league-spartan text-lg text-white w-full px-4"
            onClick={() => {}}
            size="lg"
            color="success"
            endContent={<EditIcon fill="white" />}
          >
            Edit steps
          </Button>
        </div>
        <Button
          className="mt-auto font-league-spartan text-lg text-white w-full px-4"
          onClick={() => {}}
          size="lg"
          color="success"
          endContent={<SaveIcon stroke="rgb(34 197 94)" fill="white" />}
        >
          Save recipe
        </Button>
      </div>
    </div>
  );
}

export default SideBar;
