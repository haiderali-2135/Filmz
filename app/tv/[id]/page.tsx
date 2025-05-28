"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Calendar, Clock, Users } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MediaCard from "@/components/media-card"
import ReviewSection from "@/components/review-section"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import type { TVShowDetails, TVShow } from "@/lib/tmdb"

export default function TVShowDetailsPage() {
  const params = useParams()
  const showId = params.id as string
  const [show, setShow] = useState<TVShowDetails | null>(null)
  const [relatedShows, setRelatedShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)
  const [relatedLoading, setRelatedLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (showId) {
      fetchShowDetails()
      fetchRelatedShows()
    }
  }, [showId])

  const fetchShowDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/tv/${showId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch TV show details")
      }

      const data = await response.json()
      setShow(data)
    } catch (err) {
      setError("Failed to load TV show details. Please try again later.")
      console.error("Error fetching TV show details:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedShows = async () => {
    try {
      setRelatedLoading(true)
      const response = await fetch(`/api/tv/${showId}/related`)

      if (response.ok) {
        const data = await response.json()
        setRelatedShows(data)
      }
    } catch (err) {
      console.error("Error fetching related TV shows:", err)
    } finally {
      setRelatedLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-filmz">
        <Header />
        <Loading message="Loading TV show details..." />
        <Footer />
      </div>
    )
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-gradient-filmz">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert className="bg-red-50 border-red-200 mb-8">
            <AlertDescription className="text-red-700">{error || "TV show not found"}</AlertDescription>
          </Alert>
          <Link href="/">
            <Button variant="outline" className="border-filmz-border text-filmz-text-primary hover:bg-filmz-lilac/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : "/placeholder.svg?height=750&width=500"

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : "/placeholder.svg?height=720&width=1280"

  const firstAirYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : "N/A"

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="min-h-screen bg-gradient-filmz">
      <Header />

      {/* Backdrop */}
      <motion.div
        className="relative h-96 md:h-[500px] overflow-hidden"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image src={backdropUrl || "/placeholder.svg"} alt={show.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-filmz-bg-primary via-filmz-bg-primary/60 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Poster */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-64 h-96 mx-auto md:mx-0 rounded-lg overflow-hidden shadow-2xl border border-filmz-border">
              <Image src={posterUrl || "/placeholder.svg"} alt={show.name} fill className="object-cover" />
            </div>
          </motion.div>

          {/* Show Info */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link href="/" className="inline-block mb-4">
                <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
                  <Button
                    variant="outline"
                    className="border-filmz-border text-filmz-text-primary hover:bg-filmz-lilac/20 bg-white/80 backdrop-blur-sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-filmz-border"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-filmz-text-primary">{show.name}</h1>

              {/* Show Meta */}
              <motion.div
                className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-filmz-text-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 text-filmz-orange-light fill-current" />
                  <span className="font-semibold">{show.vote_average.toFixed(1)}</span>
                  <span className="text-sm ml-1">({show.vote_count} votes)</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>{firstAirYear}</span>
                </div>

                {show.episode_run_time && show.episode_run_time.length > 0 && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-1" />
                    <span>{formatRuntime(show.episode_run_time[0])} per episode</span>
                  </div>
                )}

                <div className="flex items-center">
                  <span className="font-semibold">{show.number_of_seasons}</span>
                  <span className="ml-1">{show.number_of_seasons === 1 ? "Season" : "Seasons"}</span>
                </div>
              </motion.div>

              {/* Genres */}
              {show.genres && show.genres.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  {show.genres.map((genre, index) => (
                    <motion.div
                      key={genre.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                    >
                      <Badge className="bg-filmz-orange text-white">{genre.name}</Badge>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Overview */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-filmz-text-primary">Overview</h2>
                <p className="text-filmz-text-secondary text-lg leading-relaxed">
                  {show.overview || "No overview available."}
                </p>
              </motion.div>

              {/* Production Companies */}
              {show.production_companies && show.production_companies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <h3 className="text-xl font-bold mb-3 text-filmz-text-primary flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Production Companies
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {show.production_companies.map((company, index) => (
                      <motion.div
                        key={company.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1.6 + index * 0.1 }}
                      >
                        <Badge variant="outline" className="border-filmz-border text-filmz-text-secondary">
                          {company.name}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <ReviewSection movieId={Number.parseInt(showId)} />

        {/* Related Shows */}
        <AnimatePresence>
          {relatedShows.length > 0 && (
            <motion.section
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-filmz-border mb-8">
                <h2 className="text-2xl font-bold text-filmz-text-primary">Related Shows</h2>
                <p className="text-filmz-text-secondary mt-2">Shows you might also enjoy</p>
              </div>

              {relatedLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-filmz-orange mx-auto"></div>
                  <p className="text-filmz-text-secondary mt-2">Loading related shows...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {relatedShows.slice(0, 10).map((relatedShow, index) => (
                    <MediaCard key={relatedShow.id} media={relatedShow} mediaType="tv" index={index} />
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  )
}
