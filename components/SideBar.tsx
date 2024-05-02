import React from "react";

interface Props {
  children: React.ReactNode;
}

function SideBar({ children }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full gap-y-8 w-[350px] 2xl:w-[450px] p-6 2xl:p-8">
        {children}
      </div>
    </div>
  );
}

export default SideBar;
