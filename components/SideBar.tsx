import React from "react";

interface Props {
  children: React.ReactNode;
}

function SideBar({ children }: Props) {
  return (
    <div className="fixed z-20 flex flex-col h-dvh bg-light-black text-white md:relative">
      <div className="flex flex-col h-full gap-y-8 w-[250px] lg:w-[350px] 2xl:w-[450px] p-4 lg:p-6 2xl:p-8 mb-[4.5rem]">
        {children}
      </div>
    </div>
  );
}

export default SideBar;
