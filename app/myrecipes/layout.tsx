import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="h-screen flex flex-col overflow-x-hidden bg-light-grey">
      <Navbar isUserLoggedIn={user !== null} maxWidth="full" />
      {children}
    </div>
  );
}
