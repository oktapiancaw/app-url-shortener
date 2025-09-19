import { supabase } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

function generateShortCode(length: number = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function isAllowedDomain(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return parsed.hostname === "oxtcaw.com" || parsed.hostname.endsWith(".oxtcaw.com")
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const { original_url } = await req.json()

  if (!original_url) {
    return NextResponse.json({ error: "Original URL required" }, { status: 400 })
  }

  if (!isAllowedDomain(original_url)) {
    return NextResponse.json(
      { error: "Only URLs from oxtcaw.com or its subdomains are allowed" },
      { status: 400 }
    )
  }

  const short_code = generateShortCode()

  const { data, error } = await supabase
    .from("short_urls")
    .insert([{ original_url, short_code }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    short_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${data.short_code}`,
    original_url: data.original_url,
    code: short_code
  })
}