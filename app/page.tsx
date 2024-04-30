"use client";
import { NextUIProvider } from "@nextui-org/system";

import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <NextUIProvider>
      <main className="flex flex-col items-center justify-center">
        <Navbar />
      </main>
    </NextUIProvider>
  );
}
