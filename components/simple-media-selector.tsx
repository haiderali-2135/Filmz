"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Film, Tv } from "lucide-react"
import type { MediaType } from "@/lib/tmdb"

interface SimpleMediaSelectorProps {
  selectedMediaType: MediaType
  onMediaTypeChange: (mediaType: MediaType) => void
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

export default function SimpleMediaSelector({ selectedMediaType, onMediaTypeChange }: SimpleMediaSelectorProps) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-filmz-border/50 shadow-sm">
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
