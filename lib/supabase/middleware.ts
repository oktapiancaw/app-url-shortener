import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { supabase } from "./client"

function normalizeUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url
  }
  return url
}

export async function shortenerMiddleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const path = url.pathname
  const allowedApis = ["/api/qr", "/api/shorten"]

  if (
    path !== "/" &&
    (!path.startsWith("/api") || allowedApis.includes(path) === false)
  ) {
    const code = url.pathname.slice(1) // ambil kode tanpa "/"

    const { data } = await supabase
      .from("short_urls")
      .select("original_url")
      .eq("short_code", code)
      .single()

    if (data?.original_url) {
      const safeUrl = normalizeUrl(data.original_url)
      return NextResponse.redirect(safeUrl)
    }

    return NextResponse.rewrite(new URL("/404", req.url)) // ✅ tidak loop
  }

  return NextResponse.next()
}
