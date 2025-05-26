"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import type { Movie } from "@/lib/tmdb"

interface MovieCardProps {
  movie: Movie
  index?: number
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg?height=750&width=500"

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.01,
        ease: "easeOut",
      }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/movie/${movie.id}`}>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl bg-filmz-card-bg border-filmz-border overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-[2/3] overflow-hidden">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className="w-full h-full">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>

              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Rating Badge */}
              <motion.div
                className="absolute top-2 right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
              >
                <Badge className="bg-filmz-orange text-white font-semibold shadow-lg">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </Badge>
              </motion.div>
            </div>

            <motion.div
              className="p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-filmz-text-primary group-hover:text-filmz-orange-light transition-colors">
                {movie.title}
              </h3>

              <div className="flex items-center text-sm text-filmz-text-secondary mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{releaseYear}</span>
              </div>

              <p className="text-sm text-filmz-text-secondary line-clamp-3">
                {movie.overview || "No description available."}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
