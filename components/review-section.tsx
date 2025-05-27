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
  movieId: number
}

export default function ReviewSection({ movieId }: ReviewSectionProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)

  const form = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      movieId,
      rating: 5,
      comment: "",
    },
  })

  useEffect(() => {
    fetchReviews()
  }, [movieId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews/${movieId}`)
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
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchReviews()
        form.reset({ movieId, rating: 5, comment: "" })
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
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
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

  return (
    <motion.section
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-filmz-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-filmz-orange-light" />
            <h2 className="text-2xl font-bold text-filmz-text-primary">Reviews ({reviews.length})</h2>
          </div>

          {session && (
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-filmz-orange hover:bg-filmz-orange-hover text-white"
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
              className="mb-6"
            >
              <Card className="bg-white/80 border-filmz-border">
                <CardHeader>
                  <CardTitle className="text-lg text-filmz-text-primary">Write Your Review</CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="mb-4 bg-red-50 border-red-200">
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-filmz-text-primary mb-2">Rating</label>
                      {renderStars(form.watch("rating"), true, (rating) => form.setValue("rating", rating))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-filmz-text-primary mb-2">
                        Comment (Optional)
                      </label>
                      <Textarea
                        placeholder="Share your thoughts about this movie..."
                        {...form.register("comment")}
                        className="border-filmz-border focus:border-filmz-orange-light"
                        rows={4}
                      />
                      {form.formState.errors.comment && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.comment.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-filmz-orange hover:bg-filmz-orange-hover text-white"
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
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-filmz-orange mx-auto"></div>
            <p className="text-filmz-text-secondary mt-2">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/80 border-filmz-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-filmz-lilac/30 rounded-full">
                          <User className="h-5 w-5 text-filmz-text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-filmz-text-primary">{review.user.name || review.user.email}</p>
                          <div className="flex items-center space-x-2 text-sm text-filmz-text-secondary">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>

                    {review.comment && <p className="text-filmz-text-secondary leading-relaxed">{review.comment}</p>}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-filmz-text-secondary mx-auto mb-4" />
            <p className="text-filmz-text-secondary">No reviews yet. Be the first to review this movie!</p>
          </div>
        )}
      </div>
    </motion.section>
  )
}
