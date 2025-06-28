import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Movies.css";
import LoadingScreen from "./LoadingScreen";
import Header from "./Header";

const API_KEY = "ecf26f78d899754853efc76e880258b3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  useEffect(() => {
    async function fetchGenres() {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      );
      const data = await res.json();
      setGenres(data.genres);
    }
    fetchGenres();
  }, []);

  const fetchMovies = useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : "";
        const yearParam = selectedYear ? `&primary_release_year=${selectedYear}` : "";

        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=primary_release_date.desc&page=${
            reset ? 1 : page
          }${genreParam}${yearParam}&vote_count.gte=500&primary_release_date.lte=${todayStr}`
        );
        const data = await res.json();

        const filtered = data.results.filter(
          (movie) =>
            movie.release_date &&
            new Date(movie.release_date) <= today &&
            movie.poster_path
        );

        if (reset) {
          setMovies(filtered);
          setPage(2);
        } else {
          setMovies((prev) => [...prev, ...filtered]);
          setPage((prev) => prev + 1);
        }

        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedGenre, selectedYear, page, todayStr, today]
  );

  useEffect(() => {
    fetchMovies(true);
  }, [fetchMovies]);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setPage(1);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setPage(1);
  };

  return (
    <div className="movies-page">
      <Header />

      {loading && movies.length === 0 ? (
        <LoadingScreen />
      ) : (
        <>
          <h1 className="movies-heading">Movies</h1>

          <div className="filters">
            <select value={selectedGenre} onChange={handleGenreChange}>
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option value={genre.id} key={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            <select value={selectedYear} onChange={handleYearChange}>
              <option value="">All Years</option>
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="movies-grid">
            {movies.map((movie) => (
              <Link
                to={`/movie/${movie.id}/${movie.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}`}
                key={movie.id}
                className="movie-card"
              >
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                />
              </Link>
            ))}
          </div>

          {hasMore && (
            <button className="load-more" onClick={() => fetchMovies(false)}>
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
}
