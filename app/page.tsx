"use client";
import { NextUIProvider } from "@nextui-org/system";
import DashBoard from "./dashboard/page";

export default function Home() {
  return (
    <NextUIProvider>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <DashBoard />
      </main>
    </NextUIProvider>
  );
}
