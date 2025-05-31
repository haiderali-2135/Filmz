import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Filmz",
  description: "Discover and explore movies with Filmz",
  icons: {
    icon: '/icon1.png',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-filmz text-filmz-text-primary min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
