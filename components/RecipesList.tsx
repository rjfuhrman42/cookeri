"use client";
import React, { useEffect, useState } from "react";
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
import { Input } from "@heroui/input";

type Props = {
  recipes: Recipe[];
};

type SortingCategories = "recent" | "a-z" | "z-a";

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
    const selectedCategory = selectedValue as SortingCategories;

    if (!selectedValue || !recipes) return;

    switch (selectedCategory) {
      case "recent":
        setRecipesList(recipes);
        break;
      case "a-z":
        setRecipesList(
          recipes.toSorted((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          })
        );
        break;
      case "z-a":
        setRecipesList(
          recipes.toSorted((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA > nameB) {
              return -1;
            }
            if (nameA < nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          })
        );
        break;
      default:
        break;
    }
  }, [selectedValue, recipes]);

  return (
    <div>
      <div className="flex py-8 gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize w-36" variant="solid" radius="sm">
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectedKeys={selectedKeys}
            selectionMode="single"
            variant="bordered"
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem key="recent">Most recent</DropdownItem>
            <DropdownItem key="a-z">Alphabetical (a-z)</DropdownItem>
            <DropdownItem key="z-a">Alphabetical (z-a)</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Input
          isClearable
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "flex-1",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          label="Search"
          placeholder="Type to search..."
          radius="lg"
        />
      </div>
      <div className="grid grid-cols-1 gap-y-8 gap-x-16 max-w-[1440px] md:gap-y-16 md:grid-cols-2 xl:grid-cols-3">
        {recipesList &&
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
