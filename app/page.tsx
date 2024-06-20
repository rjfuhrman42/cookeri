"use client";
import { NextUIProvider } from "@nextui-org/system";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

import Import from "../public/import.gif";
import Edit from "../public/edit.gif";
import FeatureBlock from "@/components/FeatureBlock";

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
      <main className="flex flex-col items-center justify-start overflow-x-hidden">
        <Navbar isUserLoggedIn={user !== null} color="cookeri-green-light" />
        <div className="flex flex-col items-center w-screen md:-mt-16">
          <Hero />
          <section className="w-full flex flex-col items-center py-48 bg-cookeri-green-light overflow-x-hidden">
            <div className="gap-y-36 container flex flex-col">
              <FeatureBlock
                title="Import"
                description="Find you favorite recipe on the web. Copy and paste the URL into Cookeri’s import bar, press the button."
                imageUrl={Import}
              />
              <FeatureBlock
                title="Edit"
                description="Make changes to the instructions or ingredients. A great way to add some notes. Even change the title to reflect your love for the recipe!"
                imageUrl={Edit}
                align="reverse"
              />
            </div>
          </section>
          <footer className="bg-light-black h-[300px] w-screen flex flex-col items-center py-8">
            <div className="container flex flex-col items-center justify-between h-full">
              <h1 className="text-cookeri-green text-4xl font-gluten font-bold">
                Cookeri
              </h1>
              <div className="flex gap-x-4">
                <a
                  href="mailto:hey@reidfuhrman.com"
                  className="uppercase text-sm font-league-spartan text-lighter-grey"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact
                </a>
                <a
                  href="/privacy-policy.pdf"
                  className="uppercase text-sm font-league-spartan text-lighter-grey"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </div>
              <p className="font-league-spartan text-base text-lighter-grey">
                © {`${new Date(Date.now()).getUTCFullYear()} `}Made with 💚 by{" "}
                <a
                  href="https://cliki.in/lxnhe5asne"
                  className="font-league-spartan text-base text-cookeri-green "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reid Fuhrman
                </a>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </NextUIProvider>
  );
}
