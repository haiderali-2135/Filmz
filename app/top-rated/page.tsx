"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import MovieCard from "@/components/movie-card"
import Loading from "@/components/loading"
import Pagination from "@/components/pagination"
import type { Movie } from "@/lib/tmdb"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Crown, Star, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function TopRatedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    if (status === "loading") return // Still loading session

    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchTopRatedMovies(1)
  }, [session, status, router])

  const fetchTopRatedMovies = async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/movies/top-rated?page=${page}`)

      if (response.status === 401) {
        router.push("/auth/signin")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch top rated movies")
      }

      const data = await response.json()
      setMovies(data.results)
      setCurrentPage(data.page)
      setTotalPages(data.total_pages)
      setTotalResults(data.total_results)
    } catch (err) {
      setError("Failed to load top rated movies. Please try again later.")
      console.error("Error fetching top rated movies:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchTopRatedMovies(page)
    // Scroll to top of movies section
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-filmz">
        <Header />
        <Loading message="Checking authentication..." />
      </div>
    )
  }

  // Show access denied if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-filmz">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <motion.div
            className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-filmz-border shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Lock className="h-16 w-16 text-filmz-orange mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-filmz-text-primary mb-4">Authentication Required</h1>
            <p className="text-filmz-text-secondary mb-6">
              You need to sign in to access the top rated movies collection.
            </p>
            <Button
              onClick={() => router.push("/auth/signin")}
              className="bg-filmz-orange hover:bg-filmz-orange-hover text-white"
            >
              Sign In to Continue
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-filmz">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-12 py-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Crown className="h-12 w-12 text-filmz-orange-light mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Top Rated Films
              </h1>
              <Crown className="h-12 w-12 text-filmz-orange-light ml-4" />
            </motion.div>
            <motion.p
              className="text-xl text-filmz-text-secondary max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover the highest-rated movies of all time. Exclusive access for our signed-in members.
            </motion.p>
          </div>
        </motion.section>

        {/* Welcome Message */}
        <motion.div
          className="mb-8 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-filmz-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-filmz-orange-light" />
              <div>
                <h2 className="text-lg font-semibold text-filmz-text-primary">
                  Welcome, {session.user?.name || session.user?.email}!
                </h2>
                <p className="text-filmz-text-secondary">Enjoy our exclusive collection of top-rated films</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="mb-8 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Loading message="Loading top rated movies..." />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Movies Grid */}
        <AnimatePresence>
          {!loading && movies.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-filmz-border mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center space-x-3">
                  <Crown className="h-6 w-6 text-filmz-orange-light" />
                  <h2 className="text-2xl font-bold text-filmz-text-primary">
                    Top Rated Movies ({totalResults.toLocaleString()} total)
                  </h2>
                </div>
                <p className="text-filmz-text-secondary mt-2">
                  The highest-rated films according to critics and audiences worldwide • Page {currentPage} of{" "}
                  {totalPages} • Showing {movies.length} movies
                </p>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map((movie, index) => (
                  <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={loading}
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* No Results */}
        <AnimatePresence>
          {!loading && movies.length === 0 && !error && (
            <motion.div
              className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-lg border border-filmz-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Crown className="h-16 w-16 text-filmz-orange mx-auto mb-4" />
              <p className="text-xl text-filmz-text-secondary mb-4">No top rated movies available at the moment.</p>
              <Button
                onClick={() => fetchTopRatedMovies(1)}
                className="bg-filmz-orange hover:bg-filmz-orange-hover text-white"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
