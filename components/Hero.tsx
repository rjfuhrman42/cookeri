import React from "react";
import { Button } from "@nextui-org/button";
import Image from "next/image";

import Cookbook from "../public/cookbook.svg";
import { Link } from "@nextui-org/link";

function Hero() {
  return (
    <section className="w-full flex justify-center">
      <div className="relative flex flex-col items-center justify-between px-12 py-12 w-[1280px] md:h-screen md:max-h-[1280px] md:flex-row">
        <div className="flex flex-col gap-y-12 md:gap-y-16 gap-x-4 lg:w-5/12">
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl lg:w-full animate-fade-in-down motion-reduce:animate-fade-in">
            Collect your favorite recipes from the web.
          </h1>
          <p className="text-base sm:text-xl animate-fade-in-down motion-reduce:animate-fade-in">
            Paste the url, import, save, then cook.<br></br>
            All of your favorite recipes from the web, in one place.
          </p>
          <Button
            as={Link}
            href="/login"
            size="lg"
            color="success"
            radius="sm"
            className="text-white py-8 px-8 w-min font-semibold font-league-spartan animate-fade-in-down motion-reduce:animate-fade-in"
          >
            Create an account
          </Button>
        </div>
        <div className="mt-8 relative">
          <Image src={Cookbook} alt="cookbook" width={600} height={600} />
          <a
            href="https://storyset.com/illustration/recipe-book/bro"
            className="block italic text-xs text-gray-400 w-full text-right"
          >
            Book illustrations by Storyset
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
