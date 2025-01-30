"use client";
import type { Selection } from "@react-types/shared";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

export default function SortingDropdown() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["most_recent"])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  return (
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
        <DropdownItem key="Most recent">Most recent</DropdownItem>
        <DropdownItem key="a-z">Alphabetical (a-z)</DropdownItem>
        <DropdownItem key="z-a">Alphabetical (z-a)</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
