"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import SearchSection from "@/components/search-section"
import MovieCard from "@/components/movie-card"
import Loading from "@/components/loading"
import Pagination from "@/components/pagination"
import type { Movie } from "@/lib/tmdb"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    fetchPopularMovies(1)
  }, [])

  const fetchPopularMovies = async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/movies/popular?page=${page}`)

      if (!response.ok) {
        throw new Error("Failed to fetch movies")
      }

      const data = await response.json()
      setMovies(data.results)
      setCurrentPage(data.page)
      setTotalPages(data.total_pages)
      setTotalResults(data.total_results)
    } catch (err) {
      setError("Failed to load movies. Please try again later.")
      console.error("Error fetching movies:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchPopularMovies(page)
    // Scroll to top of movies section
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSearch = async (query: string) => {
    try {
      setIsSearching(true)
      setError(null)
      const response = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error("Failed to search movies")
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      setError("Failed to search movies. Please try again.")
      console.error("Error searching movies:", err)
    } finally {
      setIsSearching(false)
    }
  }

  const displayedMovies = searchResults || movies
  const isShowingSearchResults = searchResults !== null

  return (
    <div className="min-h-screen bg-gradient-filmz">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <AnimatePresence>
          {!isShowingSearchResults && (
            <motion.section
              className="text-center mb-12 py-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative">
                <motion.h1
                  className="text-4xl md:text-6xl font-bold mb-6 p-2 bg-gradient-hero bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Discover Amazing Films
                </motion.h1>
                <motion.p
                  className="text-xl text-filmz-text-secondary max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Explore the latest and most popular movies. Find your next favorite film with detailed information and
                  ratings.
                </motion.p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Search Section - Always visible */}
        <SearchSection onSearch={handleSearch} isSearching={isSearching} />

        {/* Search Results Header */}
        <AnimatePresence>
          {isShowingSearchResults && (
            <motion.div
              className="mb-8 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-filmz-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-2 text-filmz-text-primary">Search Results</h2>
              <motion.button
                onClick={() => setSearchResults(null)}
                className="text-filmz-orange-light hover:text-filmz-orange-hover underline font-medium"
                whileHover={{ x: -5 }}
                transition={{ duration: 0.2 }}
              >
                ← Back to Popular Movies
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

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
              <Loading message="Loading popular movies..." />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Movies Grid */}
        <AnimatePresence>
          {!loading && displayedMovies.length > 0 && (
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
                <h2 className="text-2xl font-bold text-filmz-text-primary">
                  {isShowingSearchResults
                    ? `Found ${displayedMovies.length} movies`
                    : `Popular Movies (${totalResults.toLocaleString()} total)`}
                </h2>
                {!isShowingSearchResults && (
                  <p className="text-filmz-text-secondary mt-2">
                    Page {currentPage} of {totalPages} • Showing {movies.length} movies
                  </p>
                )}
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayedMovies.map((movie, index) => (
                  <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>

              {/* Pagination - Only show for popular movies, not search results */}
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
          {!loading && !isSearching && displayedMovies.length === 0 && isShowingSearchResults && (
            <motion.div
              className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-lg border border-filmz-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl text-filmz-text-secondary mb-4">No movies found for your search.</p>
              <motion.button
                onClick={() => setSearchResults(null)}
                className="text-filmz-orange-light hover:text-filmz-orange-hover underline font-medium"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Browse popular movies instead
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
