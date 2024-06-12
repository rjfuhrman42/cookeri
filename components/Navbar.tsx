"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextNavbar,
} from "@nextui-org/navbar";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { BookSquareIcon, ImportIcon } from "./icons";

type Props = {
  isUserLoggedIn: boolean;
  maxWidth?: "full" | "sm" | "md" | "lg" | "xl" | "2xl" | undefined;
};

function Navbar({ isUserLoggedIn, maxWidth = "xl" }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <NextNavbar maxWidth={maxWidth} className="bg-black">
      <div className="ml-3.5">
        <NavbarBrand>
          <h1 className="font-gluten font-bold text-cookeri-green">Cookeri</h1>
        </NavbarBrand>
      </div>
      {isUserLoggedIn ? (
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              className="text-white"
              as={Link}
              href="/myrecipes"
              radius="sm"
              variant={pathname === "/myrecipes" ? "bordered" : "light"}
              size="lg"
              endContent={
                <BookSquareIcon height={15} width={15} stroke="white" />
              }
            >
              My Recipes
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              className="text-white"
              as={Link}
              color="default"
              href="/importrecipe"
              radius="sm"
              variant={pathname === "/importrecipe" ? "bordered" : "light"}
              size="lg"
              endContent={<ImportIcon height={15} width={15} stroke="white" />}
            >
              Import
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              onPress={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
              color="danger"
              href="#"
              radius="none"
              variant="solid"
            >
              Log out
            </Button>
          </NavbarItem>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="/login">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="/signup" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </NextNavbar>
  );
}

export default Navbar;
