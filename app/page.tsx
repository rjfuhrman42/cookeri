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
import Footer from "@/components/Footer";
import ViewAndCook from "../public/view-and-cook.png";

import Image from "next/image";

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
          <section className="w-full bg-glass-white flex flex-col gap-16 lg:flex-row items-center justify-between py-48 lg:h-screen">
            <div className="lg:h-screen lg:w-5/12 relative flex flex-col justify-center items-end">
              <h2 className="font-bold text-5xl mb-8 w-[325px]">
                Save, View ...and Cook!
              </h2>
              <p className="text-xl w-[350px]">
                Visit your recipe collection and select your newly saved recipe.
                View it in an eye-friendly format inspired by cookbooks. After
                that you’re ready to cook.
              </p>
            </div>
            <div className="lg:h-screen lg:w-7/12 flex justify-start items-center bg-cook-collage bg-cover bg-center">
              <Image
                className="ml-8 drop-shadow-2xl rounded-lg"
                src={ViewAndCook}
                width={550}
                height={450}
                alt="cookbook"
              />
            </div>
          </section>
          <Footer />
        </div>
      </main>
    </NextUIProvider>
  );
}
