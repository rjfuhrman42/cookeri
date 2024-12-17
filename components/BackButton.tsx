"use client";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import React from "react";

import { ArrowLeftIcon } from "./icons";

interface Props {
  text: string;
  noIcon?: boolean;
  className?: string;
}

function BackButton({ text, noIcon = false, className = "" }: Props) {
  const router = useRouter();
  return (
    <Button
      className={className}
      startContent={noIcon ? <></> : <ArrowLeftIcon />}
      onPress={() => {
        router.back();
      }}
      radius="sm"
      size="lg"
    >
      {text}
    </Button>
  );
}

export default BackButton;
