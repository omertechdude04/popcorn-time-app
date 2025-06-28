import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ActorDetail.css";
import Header from './Header';
import LoadingScreen from "./LoadingScreen";

const API_KEY = 'ecf26f78d899754853efc76e880258b3';
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

export default function DirectorInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [director, setDirector] = useState(null);
  const [filmography, setFilmography] = useState([]);

  useEffect(() => {
    async function fetchDirectorData() {
      try {
        const [personRes, creditsRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/person/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(`${TMDB_BASE_URL}/person/${id}/movie_credits?api_key=${API_KEY}&language=en-US`)
        ]);

        const personData = await personRes.json();
        const creditsData = await creditsRes.json();

        setDirector(personData);

        // Filter only directed movies
        const directedMovies = creditsData.crew.filter(item => item.job === "Director");

        // Remove duplicates by id
        const unique = [];
        const seenIds = new Set();
        for (const item of directedMovies) {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            unique.push(item);
          }
        }

        setFilmography(unique);
      } catch (error) {
        console.error("Error fetching director data:", error);
      }
    }

    fetchDirectorData();
  }, [id]);

  if (!director) return <LoadingScreen />;

  function createSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  return (
    <>
      <Header />

      <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>

      <div className="actor-page">
        <div className="actor-info">
          <img
            src={director.profile_path ? `${IMAGE_BASE_URL}${director.profile_path}` : "/placeholder.png"}
            alt={director.name}
            className="actor-photo"
          />
          <div className="actor-details">
            <h1>{director.name}</h1>
            <p><strong>Birthday:</strong> {director.birthday || "Unknown"}</p>
            <p><strong>Place of Birth:</strong> {director.place_of_birth || "Unknown"}</p>
            <p><strong>Biography:</strong> {director.biography || "No biography available."}</p>
          </div>
        </div>

        <h2 style={{ textTransform: "uppercase" }}>Directed Films</h2>
        <div className="poster-grid">
          {filmography
            .filter(item => item.poster_path)
            .sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""))
            .map(item => {
              const slug = createSlug(item.title || "");
              return (
                <Link to={`/movie/${item.id}/${slug}`} key={item.id} className="poster-item">
                  <img
                    src={`${IMAGE_BASE_URL}${item.poster_path}`}
                    alt={item.title}
                  />
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
}
