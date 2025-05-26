"use client"

import type React from "react"
import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface SearchSectionProps {
  onSearch: (query: string) => void
  isSearching?: boolean
}

export default function SearchSection({ onSearch, isSearching = false }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  return (
    <motion.section
      className="mb-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-filmz-border shadow-lg">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-filmz-orange-light mr-2" />
            <h2 className="text-2xl font-bold text-filmz-text-primary">Search Movies</h2>
            <Sparkles className="h-6 w-6 text-filmz-orange-light ml-2" />
          </div>
          <p className="text-filmz-text-secondary">Find your next favorite film from thousands of movies</p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-filmz-text-secondary" />
              <Input
                type="text"
                placeholder="Search for movies, actors, directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-white border-filmz-border text-filmz-text-primary placeholder-filmz-text-secondary focus:border-filmz-orange-light focus:ring-filmz-orange-light/30 transition-all duration-300"
                disabled={isSearching}
              />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-filmz-orange hover:bg-filmz-orange-hover text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Search className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.form>

        {/* Popular search suggestions */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p className="text-sm text-filmz-text-secondary mb-3">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Marvel", "Action", "Comedy", "Drama", "Sci-Fi"].map((tag, index) => (
              <motion.button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag)
                  onSearch(tag)
                }}
                className="px-3 py-1 text-sm bg-filmz-lilac/30 text-filmz-text-secondary rounded-full hover:bg-filmz-orange-light/25 hover:text-filmz-orange-light transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
