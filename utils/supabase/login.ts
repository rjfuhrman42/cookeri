"use server";
import { headers } from "next/headers";
import { createClient } from "./server";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
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

export const signInWithEmail = async (email: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: false,
    },
  });
  if (error) {
    console.error(error);
    return;
  }
  if (!data) {
    return;
  }
};

export const verifyCode = async (email: string, code: string) => {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (error) {
    console.error(error);
    return;
  }

  if (!session) {
    console.error("No session found");
    return;
  }
};
