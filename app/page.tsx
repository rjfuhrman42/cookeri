"use client";

import ImportBar from "@/components/ImportBar";
import { useState } from "react";
import { Recipe } from "schema-dts";

export default function Home() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<Recipe | undefined>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <ImportBar url={url} setUrl={setUrl} setData={setData} />
    </main>
  );
}
