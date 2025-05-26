"use client"

import { signIn, getProviders } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-filmz flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Film className="h-10 w-10 text-filmz-orange-light" />
            <span className="text-2xl font-bold text-filmz-text-primary">Filmz</span>
          </Link>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-filmz-border shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-filmz-text-primary">Welcome Back</CardTitle>
            <CardDescription className="text-filmz-text-secondary">
              Sign in to your account to continue exploring films
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers &&
              Object.values(providers).map((provider: any) => (
                <Button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  className="w-full bg-filmz-orange hover:bg-filmz-orange-hover text-white"
                  size="lg"
                >
                  Sign in with {provider.name}
                </Button>
              ))}

            <div className="text-center">
              <Link href="/" className="text-sm text-filmz-text-secondary hover:text-filmz-text-primary">
                Continue without signing in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
