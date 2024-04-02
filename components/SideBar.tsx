import { Button } from "@nextui-org/button";
import React from "react";
import { EditIcon, SaveIcon } from "./icons";
import { Input } from "@nextui-org/input";

interface Props {
  children: React.ReactNode;
}

function SideBar({ children }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col h-lvh gap-y-4 w-[350px] 2xl:w-[450px] p-6 2xl:p-8">
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
            value={""}
            color="default"
            size="lg"
            onChange={() => {}}
            className="w-full"
            name="recipe-title"
          />
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
