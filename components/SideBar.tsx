import React from "react";

interface Props {
  children: React.ReactNode;
}

function SideBar({ children }: Props) {
  return (
    <div className="h-full z-20 flex flex-col bg-light-black text-white relative">
      <div className="flex flex-col flex-1 justify-start gap-y-8 w-[250px] lg:w-[350px] 2xl:w-[450px] p-4 lg:p-6 2xl:p-8">
        {children}
      </div>
    </div>
  );
}

export default SideBar;
