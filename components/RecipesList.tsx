import { Listbox, ListboxItem } from "@heroui/listbox";
import React, { useMemo, useState } from "react";
import { Recipe } from "@/app/myrecipes/page";

type Props = {
  recipes: Recipe[];
  onRecipeChange: (value: string) => void;
};

function RecipesList({ recipes, onRecipeChange }: Props) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["text"]));

  const selectedValue = useMemo(() => {
    const val = Array.from(selectedKeys).join(", ");
    onRecipeChange(val);
    return val;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys]);

  return (
    <Listbox
      aria-label="Single selection example"
      disallowEmptySelection
      selectionMode="single"
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) => {
        setSelectedKeys(keys as Set<string>);
        Array.from(selectedKeys).join(", ");
      }}
    >
      {recipes.map((recipe, index) => {
        return selectedValue === index.toString() ? (
          <ListboxItem
            aria-label="Selected item"
            key={index}
            variant="solid"
            className="text-center !text-white !bg-glass-white"
          >
            <p className="py-2 px-3 text-white !text-lg">{recipe.name}</p>
          </ListboxItem>
        ) : (
          <ListboxItem
            variant="bordered"
            key={index}
            className="text-left"
            aria-label="Selected item"
          >
            <p className="py-2 px-3 !text-lg">{recipe.name}</p>
          </ListboxItem>
        );
      })}
    </Listbox>
  );
}

export default RecipesList;
