"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Recipe } from "@/app/myrecipes/page";
import { Image } from "@heroui/image";
import { Card, CardFooter } from "@heroui/card";
import { Link } from "@heroui/link";

import type { Selection } from "@react-types/shared";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

type Props = {
  recipes: Recipe[];
};

function RecipesList({ recipes }: Props) {
  const [recipesList, setRecipesList] = useState<Recipe[]>(recipes);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["recent"])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  useEffect(() => {
    console.log("val", selectedValue);
    if (!selectedValue) return;
  }, [selectedValue]);

  return (
    <div>
      <div className="py-8">
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize w-36" variant="solid">
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectedKeys={selectedKeys}
            selectionMode="single"
            variant="solid"
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem key="recent">Most recent</DropdownItem>
            <DropdownItem key="a-z">Alphabetical (a-z)</DropdownItem>
            <DropdownItem key="z-a">Alphabetical (z-a)</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="grid grid-cols-1 gap-y-8 gap-x-16 max-w-[1440px] md:gap-y-16 md:grid-cols-2 xl:grid-cols-3">
        {recipes &&
          recipesList.map((recipe) => {
            const { name, image, id } = recipe;
            return (
              <Card
                isPressable
                radius="sm"
                className="w-[350px]"
                key={id}
                as={Link}
                href={`myrecipes/${id}`}
              >
                <Image
                  alt="Card background"
                  className="object-cover p-2 rounded-xl"
                  src={image}
                  width={350}
                  height={250}
                  radius="none"
                />
                <CardFooter className="pt-4">
                  <h2 className="font-bold text-2xl">{name}</h2>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

export default RecipesList;
