"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Recipe } from "@/app/myrecipes/page";
import { Image } from "@heroui/image";
import { Card, CardFooter } from "@heroui/card";
import { Link } from "@heroui/link";
import debounce from "lodash/debounce";

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

  const [searchInput, setSearchInput] = useState<string>("");

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

  useEffect(() => {
    if (!searchInput) {
      setRecipesList(recipes);
      return;
    }
  }, [searchInput, recipes]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = e.target.value;
    setSearchInput(searchValue);
    // Verify the user is done typing and then search
    verify(searchValue);
  }

  /*
   1. Cache the function between renders
   2. Debounce the function to avoid calling it too often 
  */

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const verify = useCallback(
    debounce((searchValue: string) => {
      if (!searchValue) {
        setRecipesList(recipes);
        return;
      }
      const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setRecipesList(filteredRecipes);
    }, 500),
    []
  );

  return (
    <div>
      <div className="flex py-8 gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize w-36 h-auto"
              variant="faded"
              radius="sm"
            >
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectedKeys={selectedKeys}
            selectionMode="single"
            variant="faded"
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem key="recent">Most recent</DropdownItem>
            <DropdownItem key="a-z">Alphabetical (a-z)</DropdownItem>
            <DropdownItem key="z-a">Alphabetical (z-a)</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Input
          isClearable
          onClear={() => setSearchInput("")}
          classNames={{
            label: "text-black/50",
            input: ["text-black/90 ", "placeholder:text-default-700/50"],
            inputWrapper: [
              "shadow-xl",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "!cursor-text",
              "max-w-72",
            ],
          }}
          label="Search"
          placeholder="Type to search..."
          radius="sm"
          value={searchInput}
          onChange={handleSearch}
        />
      </div>
      <div className="container pb-16 grid grid-cols-1 justify-items-between gap-y-8 gap-x-16 md:gap-y-16 md:grid-cols-2 xl:grid-cols-3 xl:min-w-[1280px]">
        {recipesList && recipesList.length > 0 ? (
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
          })
        ) : (
          <h1>No recipes found!</h1>
        )}
      </div>
    </div>
  );
}

export default RecipesList;
