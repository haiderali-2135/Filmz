"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Film, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from "@/lib/validations"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSignIn = async (data: SignInInput) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUp = async (data: SignUpInput) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        // Auto sign in after successful signup
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        })

        if (result?.error) {
          setError("Account created but sign in failed. Please try signing in manually.")
        } else {
          router.push("/")
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to create account")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" })
  }

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

        <Card className="bg-white/80 backdrop-blur-sm border-filmz-border shadow-xl overflow-hidden">
          {/* Toggle Buttons */}
          <div className="flex bg-filmz-gray/30">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                !isSignUp
                  ? "bg-white text-filmz-orange-light border-b-2 border-filmz-orange-light"
                  : "text-filmz-text-secondary hover:text-filmz-text-primary"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                isSignUp
                  ? "bg-white text-filmz-orange-light border-b-2 border-filmz-orange-light"
                  : "text-filmz-text-secondary hover:text-filmz-text-primary"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isSignUp ? (
                <motion.div
                  key="signin"
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-filmz-text-primary">Welcome Back</CardTitle>
                    <CardDescription className="text-filmz-text-secondary">
                      Sign in to continue exploring films
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          {...signInForm.register("email")}
                          className="border-filmz-border focus:border-filmz-orange-light"
                        />
                        {signInForm.formState.errors.email && (
                          <p className="text-sm text-red-600">{signInForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...signInForm.register("password")}
                            className="border-filmz-border focus:border-filmz-orange-light pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-filmz-text-secondary hover:text-filmz-text-primary"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {signInForm.formState.errors.password && (
                          <p className="text-sm text-red-600">{signInForm.formState.errors.password.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-filmz-orange hover:bg-filmz-orange-hover text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Sign In
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-filmz-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-filmz-text-secondary">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      className="w-full border-filmz-border text-filmz-text-primary hover:bg-filmz-lilac/20"
                    >
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>

                    <div className="text-center">
                      <Link href="/" className="text-sm text-filmz-text-secondary hover:text-filmz-text-primary">
                        Continue without signing in
                      </Link>
                    </div>
                  </CardContent>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-filmz-text-primary">Create Account</CardTitle>
                    <CardDescription className="text-filmz-text-secondary">
                      Join Filmz to start exploring movies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your name"
                          {...signUpForm.register("name")}
                          className="border-filmz-border focus:border-filmz-orange-light"
                        />
                        {signUpForm.formState.errors.name && (
                          <p className="text-sm text-red-600">{signUpForm.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          {...signUpForm.register("email")}
                          className="border-filmz-border focus:border-filmz-orange-light"
                        />
                        {signUpForm.formState.errors.email && (
                          <p className="text-sm text-red-600">{signUpForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            {...signUpForm.register("password")}
                            className="border-filmz-border focus:border-filmz-orange-light pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-filmz-text-secondary hover:text-filmz-text-primary"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {signUpForm.formState.errors.password && (
                          <p className="text-sm text-red-600">{signUpForm.formState.errors.password.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-filmz-orange hover:bg-filmz-orange-hover text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Create Account
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-filmz-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-filmz-text-secondary">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      className="w-full border-filmz-border text-filmz-text-primary hover:bg-filmz-lilac/20"
                    >
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>

                    <div className="text-center">
                      <Link href="/" className="text-sm text-filmz-text-secondary hover:text-filmz-text-primary">
                        Continue without signing in
                      </Link>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  )
}
