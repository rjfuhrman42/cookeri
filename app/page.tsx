"use client";
import { NextUIProvider } from "@nextui-org/system";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import { Button } from "@nextui-org/button";
import Image from "next/image";

import Cookbook from "../public/cookbook.svg";

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
            <div className="flex flex-row items-center justify-between px-12 w-[1280px] h-[1080px]">
              <div className="flex flex-col w-5/12 gap-y-16 gap-x-4">
                <h1 className="font-bold text-5xl">
                  Collect your favorite recipes from the web.
                </h1>
                <p className="container text-xl">
                  Paste the url, import, save, then cook.<br></br>
                  All of your favorite recipes from the web, in one place.
                </p>

                <Button
                  size="lg"
                  color="success"
                  radius="sm"
                  className="text-white py-8 px-8 w-min font-semibold"
                >
                  Create an account
                </Button>
              </div>
              <div className="">
                <Image src={Cookbook} alt="cookbook" width={650} height={650} />
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
