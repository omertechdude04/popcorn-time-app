import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import Header from "./Header";
import ReminderPopup from "./ReminderPopup"; // Adjust path if it's in another folder

const API_KEY = "ecf26f78d899754853efc76e880258b3";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [newEpisodes, setNewEpisodes] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  // 🆕 Username state
  const [userName, setUserName] = useState("");
  const [isReturningUser, setIsReturningUser] = useState(false);

  // 🆕 Greeting logic
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
      setIsReturningUser(true);
    } else {
      let name = "";
      while (!name) {
        name = prompt("Welcome! What's your name?");
      }
      setUserName(name);
      localStorage.setItem("userName", name);
    }
  }, []);

  // 📦 Fetch movie/show data
  useEffect(() => {
    async function fetchData() {
      try {
        const [moviesRes, showsRes, airingWeekRes, topRatedRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`),
          fetch(`${TMDB_BASE_URL}/trending/tv/week?api_key=${API_KEY}`),
          fetch(`${TMDB_BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`),
          fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`),
        ]);

        const [moviesData, showsData, airingWeekData, topRatedData] = await Promise.all([
          moviesRes.json(),
          showsRes.json(),
          airingWeekRes.json(),
          topRatedRes.json(),
        ]);

        const today = new Date();
        const oneWeekAhead = new Date();
        oneWeekAhead.setDate(today.getDate() + 7);

        const detailedEpisodes = await Promise.all(
          airingWeekData.results.map(async (show) => {
            try {
              const showDetailsRes = await fetch(`${TMDB_BASE_URL}/tv/${show.id}?api_key=${API_KEY}&language=en-US`);
              const showDetails = await showDetailsRes.json();

              const ep = showDetails.next_episode_to_air || showDetails.last_episode_to_air;
              const networks = showDetails.networks?.map((n) => n.name).join(", ") || "";

              const airDate = ep?.air_date ? new Date(ep.air_date) : null;
              if (!airDate || airDate < today || airDate > oneWeekAhead) return null;

              return {
                id: show.id,
                name: show.name,
                poster_path: show.poster_path,
                seasonNum: ep?.season_number ?? "",
                episodeNum: ep?.episode_number ?? "",
                episodeTitle: ep?.name ?? "",
                episodeAirDate: ep?.air_date ?? "",
                networks,
              };
            } catch (error) {
              console.warn("Episode fetch failed for", show.name);
              return null;
            }
          })
        );

        const validEpisodes = detailedEpisodes.filter(Boolean);

        setPopularMovies(moviesData.results);
        setPopularShows(showsData.results);
        setNewEpisodes(validEpisodes);
        setTopRatedMovies(topRatedData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  function formatAirDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { weekday: "long", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  function renderCarouselItems(items, isMovie = true, showDetails = false) {
    return (
      <div className="carousel">
        {items.map((item) => (
          <Link
            to={`/${isMovie ? "movie" : "tvshow"}/${item.id}/${(item.title || item.name)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")}`}
            key={item.id}
          >
            <div className="carousel-item">
              <img
                className="carousel-poster"
                src={item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : "/placeholder.png"}
                alt={isMovie ? item.title : item.name}
              />
              {showDetails && (
                <>
                  <p className="show-title">{item.name}</p>
                  <p className="episode-code">
                    S{item.seasonNum} EP{item.episodeNum}
                  </p>
                  {item.episodeTitle && <p className="episode-title">"{item.episodeTitle}"</p>}
                  {(item.episodeAirDate || item.networks) && (
                    <p className="air-date">
                      Airs on {formatAirDate(item.episodeAirDate)}
                      {item.networks && (
                        <>
                          <br />
                          on {item.networks}
                        </>
                      )}
                    </p>
                  )}
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <>
      <ReminderPopup />
      <Header />

      <section className="hero">
        <div className="hero-content">
          <h1>
            {userName
              ? isReturningUser
                ? `Welcome back, ${userName}`
                : `Welcome, ${userName}`
              : "Welcome to Popcorn Time"}
          </h1>
          <p>Explore the world of movies and TV shows. Check out what's trending, new, and top-rated!</p>
        </div>
      </section>

      <section className="featured-movies">
        <h2>Popular Movies</h2>
        {renderCarouselItems(popularMovies, true)}

        <h2>Popular TV Shows</h2>
        {renderCarouselItems(popularShows, false)}

        <div className="new-episodes-section">
          <h2>New Episodes This Week</h2>
          {renderCarouselItems(newEpisodes, false, true)}
        </div>

        <h2>Top Rated Movies</h2>
        {renderCarouselItems(topRatedMovies, true)}
      </section>
    </>
  );
}
