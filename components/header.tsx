"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Film, User, LogOut, Menu, X, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleTopRatedClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault()
      signIn()
    }
  }

  const isActivePage = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <motion.header
      className="bg-white/80 backdrop-blur-md border-b border-filmz-border shadow-sm sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                <Film className="h-8 w-8 text-filmz-orange-light" />
              </motion.div>
              <span className="text-xl font-bold text-filmz-text-primary">Filmz</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:flex items-center space-x-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/"
              className={`transition-colors ${
                isActivePage("/")
                  ? "text-filmz-orange-light"
                  : "text-filmz-text-secondary hover:text-filmz-orange-light"
              }`}
            >
              Home
            </Link>
            <Link
              href="/popular"
              className={`transition-colors ${
                isActivePage("/popular")
                  ? "text-filmz-orange-light"
                  : "text-filmz-text-secondary hover:text-filmz-orange-light"
              }`}
            >
              Popular
            </Link>
            {session ? (
              <Link
                href="/top-rated"
                className={`transition-colors ${
                  isActivePage("/top-rated")
                    ? "text-filmz-orange-light"
                    : "text-filmz-text-secondary hover:text-filmz-orange-light"
                }`}
              >
                Top Rated
              </Link>
            ) : (
              <button
                onClick={handleTopRatedClick}
                className="flex items-center space-x-1 text-filmz-text-secondary hover:text-filmz-orange-light transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>Top Rated</span>
              </button>
            )}
          </motion.nav>

          {/* User Menu */}
          <motion.div
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 text-filmz-text-primary hover:text-filmz-orange-light"
                    >
                      <User className="h-4 w-4" />
                      <span>{session.user?.name || session.user?.email}</span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-filmz-border">
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-filmz-text-primary hover:bg-filmz-lilac/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => signIn()} className="bg-filmz-orange hover:bg-filmz-orange-hover text-white">
                  Sign In
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div className="md:hidden" whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="text-filmz-text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-filmz-border bg-white"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.nav
                className="flex flex-col space-y-4 py-4"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link
                  href="/"
                  className={`transition-colors ${
                    isActivePage("/")
                      ? "text-filmz-orange-light"
                      : "text-filmz-text-secondary hover:text-filmz-orange-light"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/popular"
                  className={`transition-colors ${
                    isActivePage("/popular")
                      ? "text-filmz-orange-light"
                      : "text-filmz-text-secondary hover:text-filmz-orange-light"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Popular
                </Link>
                {session ? (
                  <Link
                    href="/top-rated"
                    className={`transition-colors ${
                      isActivePage("/top-rated")
                        ? "text-filmz-orange-light"
                        : "text-filmz-text-secondary hover:text-filmz-orange-light"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Top Rated
                  </Link>
                ) : (
                  <button
                    onClick={handleTopRatedClick}
                    className="flex items-center space-x-1 text-filmz-text-secondary hover:text-filmz-orange-light transition-colors text-left"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Top Rated</span>
                  </button>
                )}

                {/* Mobile Auth */}
                <div className="pt-2 border-t border-filmz-border">
                  {session ? (
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm text-filmz-text-secondary">
                        Welcome, {session.user?.name || session.user?.email}
                      </span>
                      <Button
                        onClick={() => signOut()}
                        variant="outline"
                        size="sm"
                        className="self-start border-filmz-border text-filmz-text-primary hover:bg-filmz-lilac/20"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => signIn()}
                      className="bg-filmz-orange hover:bg-filmz-orange-hover text-white self-start"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
