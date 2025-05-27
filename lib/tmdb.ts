const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
const TMDB_API_TOKEN = process.env.TMDB_API_KEY!

const headers = {
  Authorization: `Bearer ${TMDB_API_TOKEN}`,
  "Content-Type": "application/json;charset=utf-8",
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

export interface MovieDetails extends Movie {
  runtime: number
  genres: { id: number; name: string }[]
  production_companies: { id: number; name: string; logo_path: string }[]
}

export interface MoviesResponse {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
}

export const tmdbService = {
  async getPopularMovies(page = 1): Promise<MoviesResponse> {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?language=en-US&page=${page}`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch popular movies")
    }

    return response.json()
  },

  async getTopRatedMovies(page = 1): Promise<MoviesResponse> {
    const response = await fetch(`${TMDB_BASE_URL}/movie/top_rated?language=en-US&page=${page}`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch top rated movies")
    }

    return response.json()
  },

  async getMovieDetails(id: number): Promise<MovieDetails> {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?language=en-US`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch movie details")
    }

    return response.json()
  },

  async getRelatedMovies(id: number): Promise<Movie[]> {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/recommendations?language=en-US&page=1`, { headers })

    if (!response.ok) {
      // Fallback to similar movies if recommendations fail
      const similarResponse = await fetch(`${TMDB_BASE_URL}/movie/${id}/similar?language=en-US&page=1`, { headers })
      if (!similarResponse.ok) {
        throw new Error("Failed to fetch related movies")
      }
      const data = await similarResponse.json()
      return data.results.slice(0, 10)
    }

    const data = await response.json()
    return data.results.slice(0, 10)
  },

  async searchMovies(query: string): Promise<Movie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?language=en-US&query=${encodeURIComponent(query)}&page=1`,
      { headers },
    )

    if (!response.ok) {
      throw new Error("Failed to search movies")
    }

    const data = await response.json()
    return data.results
  },

  getImageUrl(path: string): string {
    return `${TMDB_IMAGE_BASE_URL}${path}`
  },
}
