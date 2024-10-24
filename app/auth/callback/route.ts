import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { isAuthApiError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const validNextUrls = ["/dashboard"]; // Add valid paths here

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  let next = requestUrl.searchParams.get("next") || "/";
  const error_description = requestUrl.searchParams.get("error_description");

  // Validate the 'next' URL
  if (!validNextUrls.includes(next)) {
    next = "/dashboard"; // Corrected default path
  }

  if (error) {
    console.error("Authentication error:", { error, error_description, code });
    return NextResponse.redirect(`${requestUrl.origin}/auth-error?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    try {
      await supabase.auth.exchangeCodeForSession(code);

      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("[login] [session] [500] Error getting user:", userError);
        return NextResponse.redirect(`${requestUrl.origin}/auth-error?error=${encodeURIComponent("Failed to get user data")}`);
      }

    } catch (error) {
      console.error("[login] [session] Error:", error);
      const errorMessage = isAuthApiError(error) ? error.message : "Unknown Error"; // More specific error message
      return NextResponse.redirect(`${requestUrl.origin}/auth-error?error=${encodeURIComponent(errorMessage)}`);
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin)); // Ensure correct URL construction
}
