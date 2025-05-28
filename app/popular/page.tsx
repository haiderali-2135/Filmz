"use client"

import { useState, useEffect, useCallback } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import CategorySelector from "@/components/category-selector"
import MovieCard from "@/components/movie-card"
import Loading from "@/components/loading"
import Pagination from "@/components/pagination"
import type { Movie, MovieCategory } from "@/lib/tmdb"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PopularMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<MovieCategory>("popular")

  useEffect(() => {
    fetchMoviesByCategory(selectedCategory, 1)
  }, [selectedCategory])

  const fetchMoviesByCategory = async (category: MovieCategory, page: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/movies/category?category=${category}&page=${page}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} movies`)
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
    fetchMoviesByCategory(selectedCategory, page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCategoryChange = (category: MovieCategory) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    setSearchResults(null) // Clear search results when changing category
  }

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null)
      return
    }

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
  }, [])

  const displayedMovies = searchResults || movies
  const isShowingSearchResults = searchResults !== null

  const getCategoryTitle = (category: MovieCategory) => {
    const titles = {
      popular: "Popular Movies",
      top_rated: "Top Rated Movies",
      now_playing: "Now Playing Movies",
      upcoming: "Upcoming Movies",
    }
    return titles[category]
  }

  const getCategoryDescription = (category: MovieCategory) => {
    const descriptions = {
      popular: "The most popular movies right now",
      top_rated: "The highest-rated films of all time",
      now_playing: "Movies currently playing in theaters",
      upcoming: "Movies coming soon to theaters",
    }
    return descriptions[category]
  }

  return (
    <div className="min-h-screen bg-gradient-filmz">
      <Header />

      <main className="container mx-auto px-4 ">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-6 "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="flex items-center justify-center mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <TrendingUp className="h-12 w-12 text-filmz-orange-light mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Discover Movies
              </h1>
              <TrendingUp className="h-12 w-12 text-filmz-orange-light ml-4" />
            </motion.div>

          </div>
        </motion.section>

         {/* Search Section */}
        <SearchSection onSearch={handleSearch} isSearching={isSearching} />
         {/* Category Selector */}
        <CategorySelector selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
       

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
              <Loading message="Loading movies..." />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayedMovies.map((movie, index) => (
                  <MovieCard key={movie.id} movie={movie} index={index} />
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
                Browse {selectedCategory} movies instead
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
