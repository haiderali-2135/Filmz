"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Star, MessageSquare, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { reviewSchema, type ReviewInput } from "@/lib/validations"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { MediaType } from "@/lib/tmdb"

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

interface ReviewSectionProps {
  mediaId: number
  mediaType: MediaType
}

export default function ReviewSection({ mediaId, mediaType }: ReviewSectionProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)

  const form = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      mediaId: Number(mediaId), // Ensure it's a number
      mediaType,
      rating: 5,
      comment: "",
    },
  })

  useEffect(() => {
    fetchReviews()
  }, [mediaId, mediaType])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews/${mediaId}?type=${mediaType}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ReviewInput) => {
    if (!session) return

    setSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          mediaId: Number(data.mediaId), // Ensure it's a number
        }),
      })

      if (response.ok) {
        await fetchReviews()
        form.reset({ 
          mediaId: Number(mediaId), 
          mediaType, 
          rating: 5, 
          comment: "" 
        })
        setShowReviewForm(false)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to submit review")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-0.5 sm:space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? "cursor-pointer hover:scale-110 p-1" : "cursor-default"} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                star <= rating ? "text-filmz-orange fill-current" : "text-gray-300"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getMediaLabel = () => {
    return mediaType === "movie" ? "movie" : "TV show"
  }

  return (
    <motion.section
      className="mt-8 sm:mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-filmz-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-filmz-orange-light flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-filmz-text-primary">
              Reviews ({reviews.length})
            </h2>
          </div>

          {session && (
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-filmz-orange hover:bg-filmz-orange-hover text-white w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2.5"
            >
              {showReviewForm ? "Cancel" : "Write Review"}
            </Button>
          )}
        </div>

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && session && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 sm:mb-6"
            >
              <Card className="bg-white/80 border-filmz-border">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl text-filmz-text-primary">
                    Write Your Review
                  </CardTitle>
                  <p className="text-sm text-filmz-text-secondary">
                    Share your thoughts about this {getMediaLabel()}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  {error && (
                    <Alert className="mb-4 bg-red-50 border-red-200">
                      <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-filmz-text-primary mb-2 sm:mb-3">
                        Rating
                      </label>
                      <div className="flex justify-center sm:justify-start">
                        {renderStars(form.watch("rating"), true, (rating) => form.setValue("rating", rating))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-filmz-text-primary mb-2 sm:mb-3">
                        Comment (Optional)
                      </label>
                      <Textarea
                        placeholder={`Share your thoughts about this ${getMediaLabel()}...`}
                        {...form.register("comment")}
                        className="border-filmz-border focus:border-filmz-orange-light text-sm sm:text-base resize-none"
                        rows={3}
                      />
                      {form.formState.errors.comment && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.comment.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-filmz-orange hover:bg-filmz-orange-hover text-white w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2.5"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-filmz-orange mx-auto"></div>
            <p className="text-filmz-text-secondary mt-2 text-sm sm:text-base">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/80 border-filmz-border">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-filmz-lilac/30 rounded-full flex-shrink-0">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-filmz-text-secondary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-filmz-text-primary text-sm sm:text-base truncate">
                            {review.user.name || review.user.email}
                          </p>
                          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-filmz-text-secondary">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center sm:justify-end">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-filmz-text-secondary leading-relaxed text-sm sm:text-base break-words">
                        {review.comment}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-filmz-text-secondary mx-auto mb-3 sm:mb-4" />
            <p className="text-filmz-text-secondary text-sm sm:text-base px-4">
              No reviews yet. Be the first to review this {getMediaLabel()}!
            </p>
          </div>
        )}
      </div>
    </motion.section>
  )
}