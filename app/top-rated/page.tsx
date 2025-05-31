"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import SimpleMediaSelector from "@/components/simple-media-selector"
import MediaCard from "@/components/media-card"
import Loading from "@/components/loading"
import Pagination from "@/components/pagination"
import type { Movie, TVShow, MediaType } from "@/lib/tmdb"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Crown, Lock } from "lucide-react"
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

  useEffect(() => {
    if (status === "loading") return // Still loading session

    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchMedia(selectedMediaType, currentPage)
  }, [session, status, router, selectedMediaType, currentPage])

  const fetchMedia = async (mediaType: MediaType, page: number) => {
    try {
      setLoading(true)
      setError(null)
      // Fix: Use the correct API endpoint path with the media type and category
      const response = await fetch(`/api/media?type=${mediaType}&category=top_rated&page=${page}`)

      if (response.status === 401) {
        router.push("/auth/signin")
        return
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch top-rated ${mediaType}`)
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
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMediaTypeChange = (mediaType: MediaType) => {
    setSelectedMediaType(mediaType)
    setCurrentPage(1)
  }

  const getTitle = () => {
    return `Top Rated ${selectedMediaType === "movie" ? "Movies" : "TV Shows"}`
  }

  const getDescription = () => {
    return `The highest-rated ${selectedMediaType === "movie" ? "films" : "shows"} of all time`
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

  return (
    <div className="min-h-screen bg-gradient-filmz">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-12 "
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
                Top Rated
              </h1>
              <Crown className="h-12 w-12 text-filmz-orange-light ml-4" />
            </motion.div>
          </div>
        </motion.section>

        {/* Media Selector */}
        <SimpleMediaSelector selectedMediaType={selectedMediaType} onMediaTypeChange={handleMediaTypeChange} />

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
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
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-filmz-text-secondary mt-2">
                  {getDescription()}
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
                onClick={() => fetchMedia(selectedMediaType, 1)}
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
