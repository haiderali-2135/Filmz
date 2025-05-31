"use client"

import { useState, useEffect, useCallback } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import TwoLevelMediaSelector from "@/components/two-level-media-selector"
import MediaCard from "@/components/media-card"
import Loading from "@/components/loading"
import Pagination from "@/components/pagination"
import type { Movie, TVShow, MediaType, MovieCategory, TVCategory } from "@/lib/tmdb"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PopularPage() {
  const [media, setMedia] = useState<(Movie | TVShow)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>("movie")
  const [selectedCategory, setSelectedCategory] = useState<MovieCategory | TVCategory>("popular")

  useEffect(() => {
    fetchMediaByCategory(selectedMediaType, selectedCategory, 1)
  }, [selectedMediaType, selectedCategory])

  const fetchMediaByCategory = async (mediaType: MediaType, category: MovieCategory | TVCategory, page: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/media?type=${mediaType}&category=${category}&page=${page}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} ${mediaType}`)
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
    fetchMediaByCategory(selectedMediaType, selectedCategory, page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMediaTypeChange = (mediaType: MediaType) => {
    setSelectedMediaType(mediaType)
    // Reset to appropriate default category
    if (mediaType === "movie") {
      setSelectedCategory("popular")
    } else {
      setSelectedCategory("popular")
    }
    setCurrentPage(1)
    setSearchResults(null) // Clear search results when changing media type
  }

  const handleCategoryChange = (category: MovieCategory | TVCategory) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    setSearchResults(null) // Clear search results when changing category
  }

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults(null)
        return
      }

      try {
        setIsSearching(true)
        setError(null)
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${selectedMediaType}`)

        if (!response.ok) {
          throw new Error(`Failed to search ${selectedMediaType}`)
        }

        const data = await response.json()
        setSearchResults(data)
      } catch (err) {
        setError(`Failed to search ${selectedMediaType}. Please try again.`)
        console.error("Error searching:", err)
      } finally {
        setIsSearching(false)
      }
    },
    [selectedMediaType],
  )

  const displayedMedia = searchResults || media
  const isShowingSearchResults = searchResults !== null

  const getTitle = () => {
    const mediaTypeLabel = selectedMediaType === "movie" ? "Movies" : "TV Shows"
    const categoryLabels = {
      popular: "Popular",
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
      now_playing: "Currently playing in theaters",
      upcoming: "Coming soon to theaters",
      on_the_air: "Currently airing on TV",
      airing_today: "Shows airing today",
    }
    return descriptions[selectedCategory as keyof typeof descriptions]
  }

  return (
    <div className="min-h-screen bg-gradient-filmz">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <TrendingUp className="h-12 w-12 text-filmz-orange-light mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Discover
              </h1>
              <TrendingUp className="h-12 w-12 text-filmz-orange-light ml-4" />
            </motion.div>
          </div>
        </motion.section>

        {/* Search Section */}
        <SearchSection onSearch={handleSearch} isSearching={isSearching} />

        {/* Media Selector */}
        <TwoLevelMediaSelector
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
          {!loading && displayedMedia.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayedMedia.map((item, index) => (
                  <MediaCard key={item.id} media={item} mediaType={selectedMediaType} index={index} />
                ))}
              </div>

              {/* Pagination - Only show for category browsing */}
              {!isShowingSearchResults && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={loading}
                />
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* No Results */}
        <AnimatePresence>
          {!loading && !isSearching && displayedMedia.length === 0 && isShowingSearchResults && (
            <motion.div
              className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-lg border border-filmz-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl text-filmz-text-secondary mb-4">
                No {selectedMediaType === "movie" ? "movies" : "shows"} found for your search.
              </p>
              <motion.button
                onClick={() => setSearchResults(null)}
                className="text-filmz-orange-light hover:text-filmz-orange-hover underline font-medium"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Browse {selectedCategory} {selectedMediaType === "movie" ? "movies" : "shows"} instead
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
