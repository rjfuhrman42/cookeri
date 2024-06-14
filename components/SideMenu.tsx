import React from "react";

interface Props {
  children: React.ReactNode;
}

function SideMenu({ children }: Props) {
  return (
    <div className="flex flex-col h-full bg-black text-white">{children}</div>
  );
}

export default SideMenu;
