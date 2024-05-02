import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const requestURL = new URL(request.url);
    const code = requestURL.searchParams.get("code");


    if (code) {
        const supabase = createClient();

        await supabase.auth.exchangeCodeForSession(code);
        redirect(`${requestURL.origin}/dashboard`);
    }
    return console.error("No credential found");

}