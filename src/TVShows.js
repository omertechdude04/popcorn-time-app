// TVShows.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TVShows.css"; // Reuse same styles
import LoadingScreen from "./LoadingScreen";
import Header from "./Header";

const API_KEY = "ecf26f78d899754853efc76e880258b3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function TVShows() {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Fetch genres on first load
  useEffect(() => {
    async function fetchGenres() {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`
      );
      const data = await res.json();
      setGenres(data.genres);
    }
    fetchGenres();
  }, []);

  // Fetch TV shows initially and on filter change
  useEffect(() => {
    fetchShows(true);
  }, [selectedGenre, selectedYear]);

  const fetchShows = async (reset = false) => {
    setLoading(true);
    try {
      const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : "";
      const yearParam = selectedYear ? `&first_air_date_year=${selectedYear}` : "";

      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&sort_by=first_air_date.desc&page=${
          reset ? 1 : page
        }${genreParam}${yearParam}&vote_count.gte=200&first_air_date.lte=${todayStr}`
      );
      const data = await res.json();

      const filtered = data.results.filter(
        (show) =>
          show.first_air_date &&
          new Date(show.first_air_date) <= today &&
          show.poster_path
      );

      if (reset) {
        setShows(filtered);
        setPage(2);
      } else {
        setShows((prev) => [...prev, ...filtered]);
        setPage((prev) => prev + 1);
      }

      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error("Failed to fetch TV shows:", error);
    } finally {
      setLoading(false);
    }
  };

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

      {loading && shows.length === 0 ? (
        <LoadingScreen />
      ) : (
        <>
          <h1 className="movies-heading">TV Shows</h1>

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
            {shows.map((show) => (
              <Link
                to={`/tvshow/${show.id}/${show.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}`}
                key={show.id}
                className="movie-card"
              >
                <img
                  src={`${IMAGE_BASE_URL}${show.poster_path}`}
                  alt={show.name}
                />
              </Link>
            ))}
          </div>

          {hasMore && (
            <button className="load-more" onClick={() => fetchShows(false)}>
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
}
