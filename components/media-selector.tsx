"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Play, TrendingUp, Crown, Calendar, Film, Tv, Radio, Clock } from "lucide-react"
import type { MediaType, MovieCategory, TVCategory } from "@/lib/tmdb"

interface MediaSelectorProps {
  selectedMediaType: MediaType
  selectedCategory: MovieCategory | TVCategory
  onMediaTypeChange: (mediaType: MediaType) => void
  onCategoryChange: (category: MovieCategory | TVCategory) => void
  availableMediaTypes?: MediaType[]
}

const mediaTypeConfig = {
  movie: {
    label: "Movies",
    icon: Film,
  },
  tv: {
    label: "TV Shows",
    icon: Tv,
  },
} as const

const movieCategoryConfig = {
  now_playing: {
    label: "Now Playing",
    icon: Play,
    description: "In theaters",
  },
  popular: {
    label: "Popular",
    icon: TrendingUp,
    description: "Trending",
  },
  top_rated: {
    label: "Top Rated",
    icon: Crown,
    description: "Highest rated",
  },
  upcoming: {
    label: "Upcoming",
    icon: Calendar,
    description: "Coming soon",
  },
} as const

const tvCategoryConfig = {
  on_the_air: {
    label: "On The Air",
    icon: Radio,
    description: "Currently airing",
  },
  popular: {
    label: "Popular",
    icon: TrendingUp,
    description: "Trending",
  },
  top_rated: {
    label: "Top Rated",
    icon: Crown,
    description: "Highest rated",
  },
  airing_today: {
    label: "Airing Today",
    icon: Clock,
    description: "Today's episodes",
  },
} as const

export default function MediaSelector({
  selectedMediaType,
  selectedCategory,
  onMediaTypeChange,
  onCategoryChange,
  availableMediaTypes = ["movie", "tv"],
}: MediaSelectorProps) {
  const getAvailableCategories = () => {
    if (selectedMediaType === "movie") {
      return ["now_playing", "popular", "top_rated", "upcoming"] as MovieCategory[]
    } else {
      return ["on_the_air", "popular", "top_rated", "airing_today"] as TVCategory[]
    }
  }

  const getCategoryConfig = (category: string) => {
    if (selectedMediaType === "movie") {
      return movieCategoryConfig[category as MovieCategory]
    } else {
      return tvCategoryConfig[category as TVCategory]
    }
  }

  const availableCategories = getAvailableCategories()

  return (
    <motion.div
      className="mb-6 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Media Type Selector */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-filmz-border/50 shadow-sm">
        <div className="flex gap-2 justify-center">
          {availableMediaTypes.map((mediaType, index) => {
            const config = mediaTypeConfig[mediaType]
            const Icon = config.icon
            const isSelected = selectedMediaType === mediaType

            return (
              <motion.div
                key={mediaType}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => onMediaTypeChange(mediaType)}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`relative h-auto px-6 py-3 flex items-center space-x-2 transition-all duration-200 ${
                    isSelected
                      ? "bg-filmz-orange hover:bg-filmz-orange-hover text-white border-filmz-orange shadow-md"
                      : "bg-white/60 hover:bg-filmz-orange/5 text-filmz-text-primary border-filmz-border/60 hover:border-filmz-orange-light/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-filmz-orange-light"}`} />
                  <span className="font-medium">{config.label}</span>
                  {isSelected && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Category Selector */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-filmz-border/50 shadow-sm">
        <div className="flex flex-wrap gap-2 justify-center">
          {availableCategories.map((category, index) => {
            const config = getCategoryConfig(category)
            const Icon = config.icon
            const isSelected = selectedCategory === category

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => onCategoryChange(category)}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`relative h-auto px-4 py-2 flex items-center space-x-2 transition-all duration-200 ${
                    isSelected
                      ? "bg-filmz-orange hover:bg-filmz-orange-hover text-white border-filmz-orange shadow-md"
                      : "bg-white/60 hover:bg-filmz-orange/5 text-filmz-text-primary border-filmz-border/60 hover:border-filmz-orange-light/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-filmz-orange-light"}`} />
                  <span className="font-medium text-sm">{config.label}</span>
                  {isSelected && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
