import { supabase } from "@/lib/supabase/client"
import { NextResponse } from "next/server"
import QRCode from "qrcode"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("short_urls")
    .select("short_code, original_url")
    .eq("short_code", code)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Short code not found" }, { status: 404 })
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${data.short_code}`

  try {
    const qrBuffer = await QRCode.toBuffer(shortUrl, { type: "png", margin: 2, width: 300,
  color: {
    dark: "#000000",
    light: "#00000000"
  } })

    const qrArray = Uint8Array.from(qrBuffer)

    return new NextResponse(qrArray, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${data.short_code}.png"`,
      },
    })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate QR" }, { status: 500 })
  }
}
