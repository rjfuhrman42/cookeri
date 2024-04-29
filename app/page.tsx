"use client";
import { NextUIProvider } from "@nextui-org/system";
import DashBoard from "./dashboard/page";

import { useState } from "react";
import LoginPage from "./login/page";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <GoogleOAuthProvider
      clientId={
        "120546747778-2qoceemajkmubvenlogo442j5l9pot7f.apps.googleusercontent.com"
      }
    >
      <NextUIProvider>
        <main className="flex flex-col items-center justify-center">
          {/* <Navbar /> */}
          {isLoggedIn ? (
            <DashBoard />
          ) : (
            <>
              <LoginPage />
            </>
          )}
        </main>
      </NextUIProvider>
    </GoogleOAuthProvider>
  );
}
