import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

const PROTECTED_PREFIXES = ["/tableau-de-bord"];

/**
 * Rafraîchit la session Supabase à chaque requête et protège les routes privées.
 * Si Supabase n'est pas configuré, laisse passer sans rien faire — l'app reste
 * navigable avec le jeu de données local.
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));

  // Mode démo — protège les routes privées via le cookie de session locale.
  if (!isSupabaseConfigured) {
    if (isProtected && !request.cookies.has("am_session")) {
      const url = request.nextUrl.clone();
      url.pathname = "/inscription";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/inscription";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
