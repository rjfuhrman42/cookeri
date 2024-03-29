import React from "react";

interface Props {}

function SideBar({ children }: Props) {
  return (
    <div className="flex flex-col h-lvh gap-y-4 bg-white w-[450px] p-8">
      <h1 className="font-gluten mb-8 text-6xl text-center font-bold text-green-500">
        Cookeri
      </h1>
      {children}
    </div>
  );
}

export default SideBar;
