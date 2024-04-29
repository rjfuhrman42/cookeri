import { Link } from "@nextui-org/link";
import { GoogleLogin } from "@react-oauth/google";
import React from "react";

function LoginPage() {
  return (
    <div className="h-screen w-full flex flex-col gap-y-8 items-center pt-36">
      <p>Welcome to</p>
      <h1 className="font-gluten font-bold text-6xl text-cookeri-green">
        Cookeri
      </h1>
      <div className="p-8 h-[400px] w-[500px] rounded-lg bg-white">
        <h2 className="font-bold">Login</h2>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
      <p>
        Don&apos;t have an account? <Link href="/signup">Sign up here.</Link>
      </p>
    </div>
  );
}

export default LoginPage;
