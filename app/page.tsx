"use client";

import ImportBar from "@/components/ImportBar";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <ImportBar url={url} setUrl={setUrl} />
    </main>
  );
}
