"use client";
import { NextUIProvider } from "@nextui-org/system";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  });

  return (
    <NextUIProvider>
      <main className="flex flex-col items-center justify-start h-screen">
        <Navbar isUserLoggedIn={user !== null} />
        <h1 className="p-36">Cookeri Home Page</h1>
      </main>
    </NextUIProvider>
  );
}
