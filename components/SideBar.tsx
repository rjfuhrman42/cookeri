import React from "react";

interface Props {
  children: React.ReactNode;
}

function SideBar({ children }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col h-lvh gap-y-8 w-[350px] 2xl:w-[450px] p-6 2xl:p-8">
        <h1 className="font-gluten mb-8 text-6xl text-center font-bold text-cookeri-green">
          Cookeri
        </h1>
        {children}
      </div>
    </div>
  );
}

export default SideBar;
