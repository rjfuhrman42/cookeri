"use client";
import { GoogleIcon } from "@/components/icons";
import {
  signInWithEmail,
  signInWithGoogle,
  verifyCode,
} from "@/utils/supabase/login";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useState } from "react";

import React from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  async function handleSignInWithEmail() {
    if (!email) {
      setIsInvalid(true);
      return;
    }
    if (codeSent) {
      // Verify code if its already been sent
      verifyCode(email, code);
    } else {
      // Otherwise, send the code and initiate email sign in
      signInWithEmail(email);
      setCodeSent(true);
    }
  }

  return (
    <div className="bg-cookeri-green-light bg-cook-collage bg-no-repeat bg-cover bg-center h-screen w-full flex flex-col gap-y-8 items-center justify-center px-4">
      <div className="flex flex-col gap-y-8 p-8 w-full sm:w-[500px] rounded-lg bg-white">
        <h1 className="font-gluten font-bold text-5xl mb-8 text-cookeri-green">
          Cookeri
        </h1>
        <h2 className="font-medium text-xl">Log in or sign up</h2>
        <form
          action={signInWithGoogle}
          className="flex flex-col justify-center items-center gap-y-4"
        >
          <Button
            startContent={
              <div className="mr-auto">
                <GoogleIcon />
              </div>
            }
            size="lg"
            fullWidth
            type="submit"
            variant="flat"
            className="text-black rounded-md"
          >
            <p className="mr-auto font-sans text-base">Continue with Google</p>
          </Button>

          <p className="separator relative text-center pt-4 w-full text-gray-600">
            or
          </p>
        </form>
        <form
          action={() => handleSignInWithEmail()}
          className="flex flex-col justify-center items-center gap-y-4"
        >
          <Input
            type="email"
            label="Email"
            name="email"
            value={email}
            size="lg"
            radius="sm"
            variant="flat"
            isInvalid={isInvalid}
            errorMessage={isInvalid ? "Please enter a valid email address" : ""}
            labelPlacement="outside"
            onChange={(e) => {
              if (isInvalid) setIsInvalid(false);
              setEmail(e.target.value);
            }}
            placeholder="jane@example.com"
          />
          {codeSent ? (
            <Input
              type="text"
              label="Verification code"
              name="code"
              value={code}
              size="lg"
              radius="sm"
              variant="flat"
              onChange={(e) => setCode(e.target.value)}
              labelPlacement="outside"
            />
          ) : (
            <></>
          )}
          <Button
            type="submit"
            size="lg"
            variant="solid"
            color="success"
            className="text-white text-md font-medium p-2 rounded-md"
            fullWidth
          >
            Continue with email
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
