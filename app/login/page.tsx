import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "../../types/supabase";
import { Login } from "./components/Login";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if the user is already authenticated
  if (user) {
    // Check if searchParams is defined and handle the 'next' parameter
    const next = searchParams && searchParams.next 
      ? Array.isArray(searchParams.next) 
        ? searchParams.next[0] 
        : searchParams.next 
      : "/"; // Default to "/" if searchParams or next is undefined

    redirect(next); // Redirect to the next URL or default to "/"
  }

  const headersList = headers();
  const host = headersList.get("host");

  return (
    <div className="flex flex-col flex-1 w-full h-[calc(100vh-73px)]">
      <Login host={host} searchParams={searchParams} />
    </div>
  );
}
