"use client";
import { NextUIProvider } from "@nextui-org/system";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import { Button } from "@nextui-org/button";
import Image from "next/image";

import Cookbook from "../public/cookbook.svg";
import { Link } from "@nextui-org/link";

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
        <Navbar isUserLoggedIn={user !== null} color="cookeri-green-light" />
        <div className="flex flex-col items-center w-screen">
          <div className="w-full flex justify-center">
            <div className="relative flex flex-col items-center justify-between px-12 pt-16 w-[1280px] h-screen max-h-[1280px] md:flex-row">
              <div className="flex flex-col gap-y-12 md:gap-y-16 gap-x-4 lg:w-5/12">
                <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl lg:w-full">
                  Collect your favorite recipes from the web.
                </h1>
                <p className="text-base sm:text-xl">
                  Paste the url, import, save, then cook.<br></br>
                  All of your favorite recipes from the web, in one place.
                </p>
                <Button
                  as={Link}
                  href="/login"
                  size="lg"
                  color="success"
                  radius="sm"
                  className="text-white py-8 px-8 w-min font-semibold font-league-spartan"
                >
                  Create an account
                </Button>
              </div>
              <div className="mt-8 relative">
                <Image src={Cookbook} alt="cookbook" width={600} height={600} />
                <a
                  href="https://storyset.com/book"
                  className="block italic text-xs text-gray-400 w-full text-right"
                >
                  Book illustrations by Storyset
                </a>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center bg-cookeri-green-light">
            <div className="flex flex-row items-center w-[1280px] h-[1080px] px-6"></div>
          </div>
        </div>
      </main>
    </NextUIProvider>
  );
}
