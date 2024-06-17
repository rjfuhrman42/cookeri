"use client";
import { NextUIProvider } from "@nextui-org/system";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

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
      <main className="flex flex-col items-center justify-start">
        <Navbar
          isUserLoggedIn={user !== null}
          color="cookeri-green-light"
          fixed
        />
        <div className="flex flex-col items-center w-screen">
          <Hero />
          <section className="w-full flex flex-col justify-center bg-cookeri-green-light">
            <div>
              <h2>Import</h2>
              <p>
                Find you favorite recipe on the web. Copy and paste the URL into
                Cookeri’s import bar, press the button.
              </p>
            </div>
            <div>
              <h2>Import</h2>
              <p>
                Find you favorite recipe on the web. Copy and paste the URL into
                Cookeri’s import bar, press the button.
              </p>
            </div>
            <div>
              <h2>Import</h2>
              <p>
                Find you favorite recipe on the web. Copy and paste the URL into
                Cookeri’s import bar, press the button.
              </p>
            </div>
          </section>
        </div>
      </main>
    </NextUIProvider>
  );
}
