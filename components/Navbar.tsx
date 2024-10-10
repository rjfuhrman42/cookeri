"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextNavbar,
} from "@nextui-org/navbar";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { BookSquareIcon, ImportIcon } from "./icons";

type Props = {
  isUserLoggedIn: boolean;
  maxWidth?: "full" | "sm" | "md" | "lg" | "xl" | "2xl" | undefined;
  color?: "black" | "cookeri-green-light";
  fixed?: boolean;
};

function Navbar({
  isUserLoggedIn,
  maxWidth = "xl",
  color = "black",
  fixed = false,
}: Props) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const bgColor = `bg-${color}`;

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <NextNavbar
      maxWidth={maxWidth}
      className={`${bgColor} ${fixed ? "fixed" : ""}`}
      height="4.5em"
      onMenuOpenChange={setIsMenuOpen}
    >
      {isUserLoggedIn ? (
        <>
          <NavbarBrand className="hidden sm:block">
            <h1 className="font-gluten font-bold text-cookeri-green">
              Cookeri
            </h1>
          </NavbarBrand>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className={
              isUserLoggedIn
                ? "text-white sm:hidden"
                : "text-cookeri-green sm:hidden"
            }
          />
          <div className="hidden sm:block">
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
                  endContent={
                    <ImportIcon height={15} width={15} stroke="white" />
                  }
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
          </div>
          <NavbarMenu className="bg-light-black flex">
            <NavbarMenuItem>
              <Button
                className="text-white"
                as={Link}
                href="/myrecipes"
                radius="sm"
                variant="light"
                size="lg"
                endContent={
                  <BookSquareIcon height={15} width={15} stroke="white" />
                }
              >
                My Recipes
              </Button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                className="text-white"
                as={Link}
                color="default"
                href="/importrecipe"
                radius="sm"
                variant="light"
                size="lg"
                endContent={
                  <ImportIcon height={15} width={15} stroke="white" />
                }
              >
                Import
              </Button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                onPress={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
                color="danger"
                href="#"
                radius="none"
                variant="light"
                size="lg"
              >
                Log out
              </Button>
            </NavbarMenuItem>
          </NavbarMenu>
          <NavbarBrand className="flex-grow-0 ml-auto sm:hidden">
            <h1 className="font-gluten font-bold text-cookeri-green">
              Cookeri
            </h1>
          </NavbarBrand>
        </>
      ) : (
        <>
          <div className="ml-3.5">
            <NavbarBrand>
              <h1 className="font-gluten font-bold text-cookeri-green">
                Cookeri
              </h1>
            </NavbarBrand>
          </div>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                as={Link}
                color="success"
                radius="sm"
                size="lg"
                href="/login"
                variant="ghost"
              >
                Sign in
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Button
                as={Link}
                color="success"
                radius="sm"
                size="lg"
                href="/login"
                variant="ghost"
                className="hover:!text-white"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        </>
      )}
    </NextNavbar>
  );
}

export default Navbar;
