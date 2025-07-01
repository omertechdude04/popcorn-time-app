import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import "./search.css";

const API_KEY = "ecf26f78d899754853efc76e880258b3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search).get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (queryParam) {
      fetchResults(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
            query
          )}&page=1&include_adult=false`
        );
        const data = await res.json();

        const filtered = data.results.filter(
          (item) =>
            (item.media_type === "movie" ||
              item.media_type === "tv" ||
              item.media_type === "person") &&
            (item.title || item.name)
        );

        setSuggestions(filtered.slice(0, 6));
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const fetchResults = async (searchQuery) => {
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          searchQuery
        )}&page=1&include_adult=false`
      );
      const data = await res.json();

      const movieAndTVResults = data.results.filter(
        (item) =>
          (item.media_type === "movie" || item.media_type === "tv") &&
          item.poster_path
      );

      const directorMatch = data.results.find(
        (item) =>
          item.media_type === "person" &&
          item.known_for_department === "Directing"
      );

      let directedCredits = [];
      if (directorMatch) {
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/person/${directorMatch.id}/combined_credits?api_key=${API_KEY}`
        );
        const creditsData = await creditsRes.json();

        directedCredits = creditsData.crew.filter(
          (item) =>
            item.job === "Director" &&
            (item.media_type === "movie" || item.media_type === "tv") &&
            item.poster_path
        );
      }

      const actorMatch = data.results.find(
        (item) =>
          item.media_type === "person" &&
          item.known_for_department === "Acting"
      );

      let actingCredits = [];
      if (actorMatch) {
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/person/${actorMatch.id}/combined_credits?api_key=${API_KEY}`
        );
        const creditsData = await creditsRes.json();

        actingCredits = creditsData.cast.filter(
          (item) =>
            (item.media_type === "movie" || item.media_type === "tv") &&
            item.poster_path
        );
      }

      const combined = [
        ...movieAndTVResults,
        ...directedCredits,
        ...actingCredits,
      ];
      const uniqueResults = combined.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) => t.id === item.id && t.media_type === item.media_type
          )
      );

      setResults(uniqueResults);
      setSuggestions([]);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSuggestionClick = (item) => {
    setQuery(item.title || item.name || "");
    setSuggestions([]);
  };

  const startListening = () => {
    if (!recognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setQuery(speechResult);
      setListening(false);
      navigate(`/search?q=${encodeURIComponent(speechResult)}`);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <div className="search-page">
      <Header />

      <h1 className="search-heading">Search</h1>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-autocomplete">
          <input
            type="text"
            placeholder="Search for movies, TV shows, actors or directors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            autoComplete="off"
          />
          <button
            type="button"
            className="mic-button"
            onClick={startListening}
            title="Search by voice"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"></path>
              <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V21H9a1 1 0 100 2h6a1 1 0 100-2h-3v-3.08A7 7 0 0019 11z"></path>
            </svg>
          </button>
          {suggestions.length > 0 && (
            <ul className="autocomplete-list">
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSuggestionClick(item)}
                  className="autocomplete-item"
                >
                  {item.title || item.name}
                  <span className="autocomplete-type">
                    ({item.media_type})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="search-results">
        {results.length === 0 && !loading && (
          <p className="no-results">No results found</p>
        )}

        {results.map((item) => {
          const slug = createSlug(item.title || item.name || "");
          const path =
            item.media_type === "movie"
              ? `/movie/${item.id}/${slug}`
              : item.media_type === "tv"
              ? `/tvshow/${item.id}/${slug}`
              : "/";

          return (
            <Link to={path} key={item.id} className="result-poster">
              <img
                src={`${IMAGE_BASE_URL}${item.poster_path}`}
                alt={item.title || item.name}
                loading="lazy"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
