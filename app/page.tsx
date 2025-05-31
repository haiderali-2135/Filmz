"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MovieCard from "@/components/movie-card"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/lib/tmdb"
import { Film, TrendingUp, Crown, Star, ArrowRight, Play, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedMovies()
  }, [])

  const fetchFeaturedMovies = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/media?type=movie&category=popular&page=1")
      if (response.ok) {
        const data = await response.json()
        // Get first 8 movies for featured section
        setFeaturedMovies(data.results.slice(0, 8))
      }
    } catch (error) {
      console.error("Error fetching featured movies:", error)
    } finally {
      setLoading(false)
    }
  }


  //defi afsdadf 
  return (
    <div className="min-h-screen bg-gradient-filmz">
      <Header />

      <main>
        {/* Hero Section */}
        <motion.section
          className="relative py-20 md:py-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Film className="h-16 w-16 text-filmz-orange-light mr-4" />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent">Filmz</h1>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Film className="h-16 w-16 text-filmz-orange-light ml-4" />
                </motion.div>
              </div>
            </motion.div>

            <motion.p
              className="text-2xl md:text-3xl text-filmz-text-secondary max-w-4xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your ultimate destination for discovering amazing films, sharing reviews, and connecting with fellow movie
              enthusiasts.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/popular">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-filmz-orange hover:bg-filmz-orange-hover text-white text-lg px-8 py-4"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Explore Movies
                  </Button>
                </motion.div>
              </Link>
              <Link href="/top-rated">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-filmz-border text-filmz-text-primary hover:bg-filmz-lilac/20 text-lg px-8 py-4"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Top Rated
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-filmz-border">
                <TrendingUp className="h-8 w-8 text-filmz-orange-light mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-filmz-text-primary mb-2">Trending</h3>
                <p className="text-filmz-text-secondary">Discover what's popular right now</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-filmz-border">
                <Star className="h-8 w-8 text-filmz-orange-light mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-filmz-text-primary mb-2">Reviews</h3>
                <p className="text-filmz-text-secondary">Share your thoughts and ratings</p>
              </div>
            </motion.div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-filmz-orange/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-filmz-lilac/20 rounded-full blur-3xl"></div>
          </div>
        </motion.section>

        {/* Featured Movies Section */}
        <motion.section
          className="py-16 bg-white/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-filmz-text-primary mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Featured Movies
              </motion.h2>
              <motion.p
                className="text-xl text-filmz-text-secondary max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                Check out some of the most popular movies trending right now
              </motion.p>
            </div>

            {loading ? (
              <Loading message="Loading featured movies..." />
            ) : (
              <AnimatePresence>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  {featuredMovies.map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <Link href="/popular">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-filmz-orange hover:bg-filmz-orange-hover text-white">
                    View All Popular Movies
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-filmz-text-primary mb-4">Why Choose Filmz?</h2>
              <p className="text-xl text-filmz-text-secondary max-w-2xl mx-auto">
                Everything you need to discover, explore, and share your love for movies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="bg-white/60 backdrop-blur-sm rounded-lg p-8 border border-filmz-border text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-filmz-orange/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-filmz-orange-light" />
                </div>
                <h3 className="text-xl font-bold text-filmz-text-primary mb-3">Discover Popular Movies</h3>
                <p className="text-filmz-text-secondary">
                  Stay up-to-date with the latest trending and popular movies from around the world.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/60 backdrop-blur-sm rounded-lg p-8 border border-filmz-border text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-filmz-orange/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-filmz-orange-light" />
                </div>
                <h3 className="text-xl font-bold text-filmz-text-primary mb-3">Rate & Review</h3>
                <p className="text-filmz-text-secondary">
                  Share your thoughts and ratings with the community. Help others discover great films.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/60 backdrop-blur-sm rounded-lg p-8 border border-filmz-border text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-filmz-orange/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-filmz-orange-light" />
                </div>
                <h3 className="text-xl font-bold text-filmz-text-primary mb-3">Exclusive Access</h3>
                <p className="text-filmz-text-secondary">
                  Sign in to access our curated collection of top-rated movies and exclusive features.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}
