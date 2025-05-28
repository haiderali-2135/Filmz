"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Play, TrendingUp, Crown, Calendar } from "lucide-react"
import type { MovieCategory } from "@/lib/tmdb"

interface CategorySelectorProps {
  selectedCategory: MovieCategory
  onCategoryChange: (category: MovieCategory) => void
  availableCategories?: MovieCategory[]
}

const categoryConfig = {
  now_playing: {
    label: "Now Playing",
    icon: Play,
    description: "Currently in theaters",
  },
  popular: {
    label: "Popular",
    icon: TrendingUp,
    description: "Trending right now",
  },
  top_rated: {
    label: "Top Rated",
    icon: Crown,
    description: "Highest rated films",
  },
  upcoming: {
    label: "Upcoming",
    icon: Calendar,
    description: "Coming soon",
  },
} as const

export default function CategorySelector({
  selectedCategory,
  onCategoryChange,
  availableCategories = ["now_playing", "popular", "top_rated", "upcoming"],
}: CategorySelectorProps) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="">
        <div className="flex flex-wrap gap-2 justify-center">
          {availableCategories.map((category, index) => {
            const config = categoryConfig[category]
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
