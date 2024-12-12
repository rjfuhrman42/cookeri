"use client";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import React from "react";

import { ArrowLeftIcon } from "./icons";

interface Props {
  text: string;
  noIcon?: boolean;
}

function BackButton({ text, noIcon = false }: Props) {
  const router = useRouter();
  return (
    <Button
      startContent={noIcon ? <></> : <ArrowLeftIcon />}
      onPress={() => {
        router.back();
      }}
    >
      {text}
    </Button>
  );
}

export default BackButton;
