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

type Props = {
  isUserLoggedIn: boolean;
  maxWidth?: "full" | "sm" | "md" | "lg" | "xl" | "2xl" | undefined;
};

function Navbar({ isUserLoggedIn, maxWidth = "xl" }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <NextNavbar maxWidth={maxWidth} className="bg-cookeri-green">
      <div className="ml-3.5">
        <NavbarBrand>
          <h1 className="font-gluten font-bold text-white">Cookeri</h1>
        </NavbarBrand>
      </div>
      {isUserLoggedIn ? (
        <NavbarContent justify="end">
          {pathname === "/myrecipes" ? (
            <></>
          ) : (
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/myrecipes"
                radius="none"
                variant="solid"
              >
                Go to dashboard
              </Button>
            </NavbarItem>
          )}

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
