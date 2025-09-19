"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setShortUrl(null)

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: originalUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
      } else {
        setShortUrl(data.short_url)
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }



  const handleCopy = () => {
    if (!shortUrl) return 
    navigator.clipboard.writeText(shortUrl)
    setIsCopied(true)

    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <>
      <header className="mb-12 flex flex-col space-y-8 justify-start items-center">
        <div className="text-center">
          <p className="font-bold text-2xl capitalize text-stone-800 dark:text-stone-100">
            URL Shortener
          </p>
          <p className="text-stone-600 dark:text-stone-300">
            <span>Only for all Sub Domain of <Link className="font-semibold" href={'https://www.oxtcaw.com'}>oxtcaw.com</Link></span>
          </p>
        </div>
      </header>
        <div className="grid grid-cols-8 w-full items-center gap-2 my-2">
          <div className="flex justify-center items-center space-x-2 col-span-6">
            <Input
              id="originalUrl"
              type="text"
              placeholder="Enter the link here"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>
          <Button variant={'default'} className="px-3 py-1 col-span-2 bg-primary" 
          onClick={handleSubmit}
          disabled={loading}>
          {loading ? "Shortening..." : "Shorten URL"}
          </Button>
        </div>
        {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}

      {shortUrl && (
        <div className="flex space-x-4 justify-center items-center py-2 mt-8">
          <p className=" text-green-600">
            Shortened URL:{" "}
            <Link href={shortUrl} target="_blank" className="font-semibold underline">
              {shortUrl}
            </Link>
          </p>

          <Button className="w-[40x] h-[40px]" variant={'outline'} onClick={() => handleCopy()}>
            <Copy/>
          </Button>
        </div>
      )}

        <span className={`text-sm ${isCopied ? 'text-foreground': 'text-background '} transition-colors  duration-300`}>Link copied!</span>
    </>
  );
}
