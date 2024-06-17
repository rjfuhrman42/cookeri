"use client";
import { NextUIProvider } from "@nextui-org/system";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Image from "next/image";
import Import from "../public/import.gif";

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
          <section className="w-full flex flex-col items-center py-24 bg-cookeri-green-light">
            <div className="bg-red-200 px-12 gap-y-36 container flex flex-col">
              <div className="flex flex-row-reverse justify-around">
                <div className="w-[300px]">
                  <h2 className="font-bold text-4xl">Import</h2>
                  <p className="text-xl">
                    Find you favorite recipe on the web. Copy and paste the URL
                    into Cookeri’s import bar, press the button.
                  </p>
                </div>
                <Image src={Import} alt="cookbook" width={400} height={400} />
              </div>
              <div className="flex flex-row justify-around">
                <div className="">
                  <h2 className="font-bold text-4xl">Import</h2>
                  <p>
                    Find you favorite recipe on the web. Copy and paste the URL
                    into Cookeri’s import bar, press the button.
                  </p>
                </div>
                <Image src={Import} alt="cookbook" width={400} height={400} />
              </div>
              <div className="flex flex-row-reverse justify-around">
                <div className="w-1/2">
                  <h2 className="font-bold text-4xl">Import</h2>
                  <p>
                    Find you favorite recipe on the web. Copy and paste the URL
                    into Cookeri’s import bar, press the button.
                  </p>
                </div>
                <Image src={Import} alt="cookbook" width={400} height={400} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </NextUIProvider>
  );
}
