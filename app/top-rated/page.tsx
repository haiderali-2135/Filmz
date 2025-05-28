"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import MediaSelector from "@/components/media-selector"
import MediaCard from "@/components/media-card"
import Loading from "@/components/loading"
import Pagination from "@/components/pagination"
import type { Movie, TVShow, MediaType, MovieCategory, TVCategory } from "@/lib/tmdb"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Crown, Star, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

export default function TopRatedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [media, setMedia] = useState<(Movie | TVShow)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>("movie")
  const [selectedCategory, setSelectedCategory] = useState<MovieCategory | TVCategory>("top_rated")

  useEffect(() => {
    if (status === "loading") return // Still loading session

    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchMedia(selectedMediaType, selectedCategory, 1)
  }, [session, status, router, selectedMediaType, selectedCategory])

  const fetchMedia = async (mediaType: MediaType, category: MovieCategory | TVCategory, page: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/media?type=${mediaType}&category=${category}&page=${page}`)

      if (response.status === 401) {
        router.push("/auth/signin")
        return
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch ${mediaType} ${category}`)
      }

      const data = await response.json()
      setMedia(data.results)
      setCurrentPage(data.page)
      setTotalPages(data.total_pages)
      setTotalResults(data.total_results)
    } catch (err) {
      setError("Failed to load content. Please try again later.")
      console.error("Error fetching media:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchMedia(selectedMediaType, selectedCategory, page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMediaTypeChange = (mediaType: MediaType) => {
    setSelectedMediaType(mediaType)
    setCurrentPage(1)
    // Reset to appropriate default category
    if (mediaType === "movie") {
      setSelectedCategory("top_rated")
    } else {
      setSelectedCategory("top_rated")
    }
  }

  const handleCategoryChange = (category: MovieCategory | TVCategory) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const getTitle = () => {
    const mediaTypeLabel = selectedMediaType === "movie" ? "Movies" : "TV Shows"
    const categoryLabels = {
      popular: "Popular",
      top_rated: "Top Rated",
      now_playing: "Now Playing",
      upcoming: "Upcoming",
      on_the_air: "On The Air",
      airing_today: "Airing Today",
    }
    return `${categoryLabels[selectedCategory as keyof typeof categoryLabels]} ${mediaTypeLabel}`
  }

  const getDescription = () => {
    const descriptions = {
      popular: "The most popular content right now",
      top_rated: "The highest-rated content of all time",
      now_playing: "Currently playing in theaters",
      upcoming: "Coming soon to theaters",
      on_the_air: "Currently airing on TV",
      airing_today: "Shows airing today",
    }
    return descriptions[selectedCategory as keyof typeof descriptions]
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
              You need to sign in to access the premium movie and TV show collections.
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
                Premium Collection
              </h1>
              <Crown className="h-12 w-12 text-filmz-orange-light ml-4" />
            </motion.div>
            <motion.p
              className="text-xl text-filmz-text-secondary max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Exclusive access to premium movie and TV show collections. Discover the highest-rated content and trending
              favorites.
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
                <p className="text-filmz-text-secondary">Enjoy our exclusive premium movie and TV show collections</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Media Selector */}
        <MediaSelector
          selectedMediaType={selectedMediaType}
          selectedCategory={selectedCategory}
          onMediaTypeChange={handleMediaTypeChange}
          onCategoryChange={handleCategoryChange}
        />

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
              <Loading message="Loading content..." />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Grid */}
        <AnimatePresence>
          {!loading && media.length > 0 && (
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
                    {getTitle()} ({totalResults.toLocaleString()} total)
                  </h2>
                </div>
                <p className="text-filmz-text-secondary mt-2">
                  {getDescription()} • Page {currentPage} of {totalPages} • Showing {media.length} items
                </p>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {media.map((item, index) => (
                  <MediaCard key={item.id} media={item} mediaType={selectedMediaType} index={index} />
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
          {!loading && media.length === 0 && !error && (
            <motion.div
              className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-lg border border-filmz-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Crown className="h-16 w-16 text-filmz-orange mx-auto mb-4" />
              <p className="text-xl text-filmz-text-secondary mb-4">No content available at the moment.</p>
              <Button
                onClick={() => fetchMedia(selectedMediaType, selectedCategory, 1)}
                className="bg-filmz-orange hover:bg-filmz-orange-hover text-white"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
