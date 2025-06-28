import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ActorDetail.css";
import Header from './Header';
import LoadingScreen from "./LoadingScreen"; 

const API_KEY = 'ecf26f78d899754853efc76e880258b3';
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

export default function ActorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    async function fetchActorData() {
      try {
        const [actorRes, creditsRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/person/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(`${TMDB_BASE_URL}/person/${id}/combined_credits?api_key=${API_KEY}&language=en-US`)
        ]);

        const actorData = await actorRes.json();
        const creditsData = await creditsRes.json();

        setActor(actorData);

        // Remove duplicates by id
        const unique = [];
        const seenIds = new Set();
        for (const item of creditsData.cast) {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            unique.push(item);
          }
        }

        setCredits(unique);
      } catch (error) {
        console.error("Error fetching actor data:", error);
      }
    }

    fetchActorData();
  }, [id]);

  if (!actor) return <LoadingScreen />;

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
            src={actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : "/placeholder.png"}
            alt={actor.name}
            className="actor-photo"
          />
          <div className="actor-details">
            <h1>{actor.name}</h1>
            <p><strong>Birthday:</strong> {actor.birthday || "Unknown"}</p>
            <p><strong>Place of Birth:</strong> {actor.place_of_birth || "Unknown"}</p>
            <p><strong>Biography:</strong> {actor.biography || "No biography available."}</p>
          </div>
        </div>

        <h2 style={{textTransform: "uppercase"}}>Appears In</h2>
        <div className="poster-grid">
          {credits
            .filter(item => item.poster_path)
            .sort((a, b) => b.popularity - a.popularity)
            .map(item => {
              const slug = createSlug(item.title || item.name || "");
              const path = item.media_type === "movie"
                ? `/movie/${item.id}/${slug}`
                : `/tvshow/${item.id}/${slug}`;

              return (
                <Link to={path} key={item.id} className="poster-item">
                  <img
                    src={`${IMAGE_BASE_URL}${item.poster_path}`}
                    alt={item.title || item.name}
                  />
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
}
