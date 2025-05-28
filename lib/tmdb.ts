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

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

export interface MovieDetails extends Movie {
  runtime: number
  genres: { id: number; name: string }[]
  production_companies: { id: number; name: string; logo_path: string }[]
}

export interface TVShowDetails extends TVShow {
  episode_run_time: number[]
  genres: { id: number; name: string }[]
  production_companies: { id: number; name: string; logo_path: string }[]
  number_of_seasons: number
  number_of_episodes: number
}

export interface MoviesResponse {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
}

export interface TVShowsResponse {
  results: TVShow[]
  page: number
  total_pages: number
  total_results: number
}

export type MediaType = "movie" | "tv"
export type MovieCategory = "popular" | "top_rated" | "now_playing" | "upcoming"
export type TVCategory = "popular" | "top_rated" | "on_the_air" | "airing_today"
export type MediaCategory = MovieCategory | TVCategory

export const tmdbService = {
  // Movie endpoints
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

  async getNowPlayingMovies(page = 1): Promise<MoviesResponse> {
    const response = await fetch(`${TMDB_BASE_URL}/movie/now_playing?language=en-US&page=${page}`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch now playing movies")
    }

    return response.json()
  },

  async getUpcomingMovies(page = 1): Promise<MoviesResponse> {
    const response = await fetch(`${TMDB_BASE_URL}/movie/upcoming?language=en-US&page=${page}`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch upcoming movies")
    }

    return response.json()
  },

  // TV Show endpoints
  async getPopularTVShows(page = 1): Promise<TVShowsResponse> {
    const response = await fetch(`${TMDB_BASE_URL}/tv/popular?language=en-US&page=${page}`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch popular TV shows")
    }

    return response.json()
  },

  async getTopRatedTVShows(page = 1): Promise<TVShowsResponse> {
    const response = await fetch(`${TMDB_BASE_URL}/tv/top_rated?language=en-US&page=${page}`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch top rated TV shows")
    }

    return response.json()
  },

  async getOnTheAirTVShows(page = 1): Promise<TVShowsResponse> {
    const response = await fetch(`${TMDB_BASE_URL}/tv/on_the_air?language=en-US&page=${page}`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch on the air TV shows")
    }

    return response.json()
  },

  async getAiringTodayTVShows(page = 1): Promise<TVShowsResponse> {
    const response = await fetch(`${TMDB_BASE_URL}/tv/airing_today?language=en-US&page=${page}`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch airing today TV shows")
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

  async getTVShowDetails(id: number): Promise<TVShowDetails> {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}?language=en-US`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch TV show details")
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

  async getRelatedTVShows(id: number): Promise<TVShow[]> {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}/recommendations?language=en-US&page=1`, { headers })

    if (!response.ok) {
      // Fallback to similar TV shows if recommendations fail
      const similarResponse = await fetch(`${TMDB_BASE_URL}/tv/${id}/similar?language=en-US&page=1`, { headers })
      if (!similarResponse.ok) {
        throw new Error("Failed to fetch related TV shows")
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

  async searchTVShows(query: string): Promise<TVShow[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?language=en-US&query=${encodeURIComponent(query)}&page=1`,
      { headers },
    )

    if (!response.ok) {
      throw new Error("Failed to search TV shows")
    }

    const data = await response.json()
    return data.results
  },

  getImageUrl(path: string): string {
    return `${TMDB_IMAGE_BASE_URL}${path}`
  },
}