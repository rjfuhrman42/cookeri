import { createClient } from "@/utils/supabase/server";
import { Link } from "@nextui-org/link";
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
    <div className="h-screen w-full flex flex-col gap-y-8 items-center pt-36">
      <p>Welcome to</p>
      <h1 className="font-gluten font-bold text-6xl text-cookeri-green">
        Cookeri
      </h1>
      <div className="p-8 h-[400px] w-[500px] rounded-lg bg-white">
        <h2 className="font-bold">Login</h2>
        <form action={signIn}>
          <button
            type="submit"
            className="bg-cookeri-green text-white p-2 rounded-lg"
          >
            Sign in with Google
          </button>
        </form>
      </div>
      <p>
        Don&apos;t have an account? <Link href="/signup">Sign up here.</Link>
      </p>
    </div>
  );
}

export default LoginPage;
