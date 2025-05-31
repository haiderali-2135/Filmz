"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Play, TrendingUp, Calendar, Film, Tv, Radio, Clock } from "lucide-react"
import type { MediaType, MovieCategory, TVCategory } from "@/lib/tmdb"

interface TwoLevelMediaSelectorProps {
  selectedMediaType: MediaType
  selectedCategory: MovieCategory | TVCategory
  onMediaTypeChange: (mediaType: MediaType) => void
  onCategoryChange: (category: MovieCategory | TVCategory) => void
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
  airing_today: {
    label: "Airing Today",
    icon: Clock,
    description: "Today's episodes",
  },
} as const

export default function TwoLevelMediaSelector({
  selectedMediaType,
  selectedCategory,
  onMediaTypeChange,
  onCategoryChange,
}: TwoLevelMediaSelectorProps) {
  const getAvailableCategories = () => {
    if (selectedMediaType === "movie") {
      return ["now_playing", "popular", "upcoming"] as MovieCategory[]
    } else {
      return ["on_the_air", "popular", "airing_today"] as TVCategory[]
    }
  }

  const getCategoryConfig = (category: string) => {
    if (selectedMediaType === "movie") {
      return movieCategoryConfig[category as keyof typeof movieCategoryConfig]
    } else {
      return tvCategoryConfig[category as keyof typeof tvCategoryConfig]
    }
  }

  const availableCategories = getAvailableCategories()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Media Type Selector */}
      <div className="">
        <div className="flex gap-4 justify-center">
          {(["movie", "tv"] as MediaType[]).map((mediaType, index) => {
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
                  size="lg"
                  className={`relative h-auto px-8 py-3 flex items-center space-x-2 transition-all duration-200 ${
                    isSelected
                      ? "bg-filmz-orange hover:bg-filmz-orange-hover text-white border-filmz-orange shadow-md"
                      : "bg-white/60 hover:bg-filmz-orange/5 text-filmz-text-primary border-filmz-border/60 hover:border-filmz-orange-light/50"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-filmz-orange-light"}`} />
                  <span className="font-medium text-lg">{config.label}</span>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Category Selector */}
      <div className="p-2">
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
                      ? "bg-gray-800 hover:bg-gray-800 text-white border-filmz-orange shadow-md"
                      : "bg-white/40 hover:bg-gray-300 text-filmz-text-primary border-filmz-border/60 hover:border-filmz-orange-light/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-filmz-orange-light"}`} />
                  <span className="font-medium text-sm">{config.label}</span>
                  
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
