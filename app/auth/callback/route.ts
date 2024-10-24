import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { isAuthApiError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const validNextUrls = ["/", "/home", "/dashboard"]; // Add valid paths here

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  let next = requestUrl.searchParams.get("next") || "/";
  const error_description = requestUrl.searchParams.get("error_description");

  // Validate the 'next' URL
  if (!validNextUrls.includes(next)) {
    next = "/"; // Default to home if the next URL is not valid
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

      // Check and create feature-flag row and credits if needed
      const { data: featureFlags, error: featureFlagsError } = await supabase
        .from('feature_flags') // Ensure 'feature_flags' is a valid table in your Database type
        .select()
        .eq('user_id', user.user.id)
        .single();

      if (featureFlagsError && featureFlagsError.code !== 'PGRST116') {
        console.error("[login] [feature_flags] Error checking feature flags:", featureFlagsError);
        // Log the error but continue the process
      }

      if (!featureFlags) {
        try {
          const { error: insertFlagError } = await supabase.from('feature_flags').insert({ user_id: user.user.id });
          if (insertFlagError) throw insertFlagError;

          const { error: insertCreditError } = await supabase.from('credits').insert({ user_id: user.user.id, amount: 0 });
          if (insertCreditError) throw insertCreditError;
        } catch (insertError) {
          console.error("[login] [insert] Error creating user data:", insertError);
          // Log the error but continue the process
        }
      }

    } catch (error) {
      console.error("[login] [session] Error:", error);
      const errorMessage = isAuthApiError(error) ? "Authentication API Error" : "Unknown Error";
      return NextResponse.redirect(`${requestUrl.origin}/auth-error?error=${encodeURIComponent(errorMessage)}`);
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin)); // Ensure correct URL construction
}
