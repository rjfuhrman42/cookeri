"use client";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import React from "react";

import { ArrowLeftIcon } from "./icons";

interface Props {
  text: string;
  noIcon?: boolean;
  className?: string;
  pathname?: string;
}

function BackButton({
  text,
  noIcon = false,
  className = "",
  pathname = "",
}: Props) {
  const router = useRouter();
  return (
    <Button
      className={className}
      startContent={noIcon ? <></> : <ArrowLeftIcon />}
      onPress={() => {
        if (pathname === "") {
          router.back();
        }
        router.push(pathname);
      }}
      radius="sm"
      size="lg"
    >
      {text}
    </Button>
  );
}

export default BackButton;
