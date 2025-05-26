"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export default function Pagination({ currentPage, totalPages, onPageChange, isLoading = false }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  if (totalPages <= 1) return null

  return (
    <motion.div
      className="flex items-center justify-center space-x-2 mt-12 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-filmz-border shadow-lg">
        <div className="flex items-center space-x-1">
          {/* Previous Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="h-10 w-10 p-0 text-filmz-text-secondary hover:text-filmz-orange-light hover:bg-filmz-orange/10 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <div className="flex items-center justify-center h-10 w-10">
                  <MoreHorizontal className="h-4 w-4 text-filmz-text-secondary" />
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    disabled={isLoading}
                    className={`h-10 w-10 p-0 ${
                      currentPage === page
                        ? "bg-filmz-orange text-white hover:bg-filmz-orange-hover"
                        : "text-filmz-text-secondary hover:text-filmz-orange-light hover:bg-filmz-orange/10"
                    } disabled:opacity-50`}
                  >
                    {page}
                  </Button>
                </motion.div>
              )}
            </div>
          ))}

          {/* Next Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="h-10 w-10 p-0 text-filmz-text-secondary hover:text-filmz-orange-light hover:bg-filmz-orange/10 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Page Info */}
      <div className="hidden sm:block text-sm text-filmz-text-secondary bg-white/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-filmz-border">
        Page {currentPage} of {totalPages}
      </div>
    </motion.div>
  )
}
