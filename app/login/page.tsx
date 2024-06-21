import { GoogleIcon } from "@/components/icons";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

function LoginPage() {
  const signIn = async () => {
    "use server";
    const supabase = createClient();
    const origin = headers().get("origin");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      console.error(error);
      return;
    } else {
      return redirect(data.url);
    }
  };

  return (
    <div className="bg-cookeri-green-light bg-cook-collage bg-no-repeat bg-cover bg-center h-screen w-full flex flex-col gap-y-8 items-center justify-center px-4">
      <div className="flex flex-col gap-y-8 p-8 w-full sm:w-[500px] rounded-lg bg-white">
        <h1 className="font-gluten font-bold text-5xl mb-8 text-cookeri-green">
          Cookeri
        </h1>
        <h2 className="font-medium text-xl">Log in or sign up</h2>
        <form
          action={signIn}
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
        <form className="flex flex-col justify-center items-center gap-y-4">
          <Input
            type="email"
            label="Email"
            size="lg"
            radius="sm"
            variant="flat"
            labelPlacement="outside"
            placeholder="jane@example.com"
          />
          <Button
            type="submit"
            size="lg"
            variant="solid"
            color="success"
            className="text-white text-md font-medium p-2 rounded-md"
            fullWidth
          >
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
