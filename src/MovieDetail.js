import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./MovieDetail.css";
import Header from './Header';
import LoadingScreen from "./LoadingScreen";

const API_KEY = "ecf26f78d899754853efc76e880258b3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const LOGO_BASE_URL = "https://image.tmdb.org/t/p/original";

// Turn title into a clean URL slug
function slugify(title) {
  return title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "movie";
}

const providerLinks = {
  "Netflix": "https://www.netflix.com",
  "HBO Max": "https://www.max.com",
  "Max": "https://www.max.com",
  "Disney Plus": "https://www.disneyplus.com",
  "Hulu": "https://www.hulu.com",
  "Apple TV": "https://tv.apple.com",
  "Apple iTunes": "https://tv.apple.com",
  "Amazon Prime Video": "https://www.primevideo.com",
  "Amazon Video": "https://www.amazon.com/Prime-Video",
  "Paramount Plus": "https://www.paramountplus.com",
  "Peacock": "https://www.peacocktv.com",
  "Peacock Premium": "https://www.peacocktv.com",
  "YouTube": "https://www.youtube.com/movies",
  "YouTube Premium": "https://www.youtube.com/premium",
  "Google Play Movies": "https://play.google.com/store/movies",
  "Google TV": "https://tv.google",
  "Vudu": "https://www.vudu.com",
  "Redbox": "https://www.redbox.com",
  "Microsoft Store": "https://www.microsoft.com/en-us/store/movies-and-tv",
  "AMC on Demand": "https://ondemand.amctheatres.com",
  "Fubo": "https://www.fubo.tv",
  "Sling TV": "https://www.sling.com",
  "Tubi TV": "https://www.tubitv.com",
  "Crunchyroll": "https://www.crunchyroll.com",
  "Pluto TV": "https://pluto.tv",
  "Shudder": "https://www.shudder.com",
  "Showtime": "https://www.showtime.com",
  "Showtime Anytime": "https://www.showtimeanytime.com",
  "The CW": "https://www.cwtv.com",
  "CW Seed": "https://www.cwseed.com",
  "BritBox": "https://www.britbox.com",
  "Acorn TV": "https://www.acorn.tv",
  "Kanopy": "https://www.kanopy.com",
  "Hoopla": "https://www.hoopladigital.com",
  "Rakuten TV": "https://www.rakuten.tv",
  "DIRECTV": "https://www.directv.com",
  "Spectrum On Demand": "https://watch.spectrum.net",
  "Xfinity": "https://www.xfinity.com/stream",
  "Viaplay": "https://viaplay.com",
  "Curiosity Stream": "https://curiositystream.com",
  "Plex": "https://www.plex.tv/watch-free",
  "MGM+": "https://www.mgmplus.com",
  "Starz": "https://www.starz.com",
  "Discovery+": "https://www.discoveryplus.com",
  "Topic": "https://www.topic.com",
  "FilmRise": "https://www.filmrise.com",
  "Docurama": "https://www.docurama.com",
  "Funimation": "https://www.funimation.com",
  "NBC": "https://www.nbc.com",
  "ABC": "https://abc.com",
  "CBS": "https://www.cbs.com",
  "Fox": "https://www.fox.com",
  "PBS": "https://www.pbs.org",
  "Alamo On Demand": "https://ondemand.drafthouse.com",
  "Sky Go": "https://www.sky.com/watch/sky-go",
  "NOW": "https://www.nowtv.com",
  "Hotstar": "https://www.hotstar.com",
  "ZEE5": "https://www.zee5.com",
  "Eros Now": "https://erosnow.com",
  "JioCinema": "https://www.jiocinema.com"
};

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchDetails() {
      try {
        const [movieRes, creditsRes, videoRes, watchRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`),
        ]);

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();
        const videoData = await videoRes.json();
        const watchData = await watchRes.json();

        setMovie(movieData);
        setCredits(creditsData);
        const trailerVideo = videoData.results.find((v) => v.type === "Trailer");
        setTrailer(trailerVideo);
        setWatchProviders(watchData.results.US);

        const genreIds = movieData.genres.map((g) => g.id).join(",");
        const discoverRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreIds}&sort_by=popularity.desc`
        );
        const discoverData = await discoverRes.json();
        const filtered = discoverData.results.filter((m) => m.id !== movieData.id);
        setRecommended(filtered.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    }


    fetchDetails();
  }, [id]);

  if (!movie || !credits) return <LoadingScreen />;

  const director = credits.crew.find((person) => person.job === "Director");
  const genres = movie.genres?.map((g) => g.name).join(", ") || "N/A";
  const releaseDate = new Date(movie.release_date);
  const today = new Date();
  const daysSinceRelease = (today - releaseDate) / (1000 * 60 * 60 * 24);
  const hasStreaming = watchProviders?.flatrate || watchProviders?.buy || watchProviders?.rent;

const isComingSoon = (date) => {
  if (!date) return false;
  const today = new Date();
  const release = new Date(date);
  return release > today;
};

const addToMyList = (movie) => {
  const savedList = JSON.parse(localStorage.getItem("myList")) || [];

  if (!savedList.find(item => item.id === movie.id)) {
    const movieToSave = {
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/nopicture.jpg",
      ...(isComingSoon(movie.release_date) && { release_date: movie.release_date })
    };

    savedList.push(movieToSave);
    localStorage.setItem("myList", JSON.stringify(savedList));
    alert(`${movie.title} added to your list!`);
  } else {
    alert(`${movie.title} is already in your list.`);
  }
};


  return (
    <>
      <Header />
      
      <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>

  
      
      <div className="movie-detail">
        <div className="detail-main">
          
          <img
            src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : ""}
            alt={movie.title || "Movie Poster"}
            className="movie-poster"
          />
          
          <div className="detail-info">
          <h1>{movie.title} ({movie.release_date?.slice(0, 4) || "N/A"})</h1>
          <button onClick={() => addToMyList(movie)} className="add-to-list-button">
            ➕ Add to My List
          </button>

          {releaseDate > today && (
            <p className="upcoming-release">
              🎉 Coming Soon on {releaseDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
            <p className="genres">{genres}</p>
            <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} min` : "Unknown"}</p>
            <div className="director-box">
              <strong>Director:</strong>{" "}
              {director ? (
                <Link to={`/director/${director.id}`} className="director-link">
                  <div className="director-thumbnail">
                    <img
                      src={director.profile_path ? `${IMAGE_BASE_URL}${director.profile_path}` : "/nopicture.jpg"}
                      alt={director.name}
                    />
                    <p>{director.name}</p>
                  </div>
                </Link>
              ) : (
                "Unknown"
              )}

            </div>
            


            <p><strong>Cast:</strong></p>
            <div className="cast-image-container">
              {credits.cast.slice(0, 8).map((c) => (
                <Link to={`/actor/${c.id}`} key={c.id} className="cast-image-link">
                  <img
                    src={c.profile_path ? `${IMAGE_BASE_URL}${c.profile_path}` : "/nopicture.jpg"}
                    alt={c.name}
                    className="cast-image"
                    title={c.name}
                  />
                  <div className="cast-name">{c.name}</div>
                  <div className="cast-character">as {c.character || "Unknown"}</div>
                </Link>
              ))}
            </div>

            <div className="rating-section">
              <img src="/imdblogo.png" alt="IMDb Logo" className="imdb-logo" />
              <span className="imdb-score">
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}/10
              </span>
            </div>



            <p><strong>What's It About?</strong> {movie.overview || "No description available."}</p>

            <div className="where-to-watch">
              <p>Where to Watch</p>
              {!hasStreaming && daysSinceRelease < 30 && (
                <p className="theater-text">🎬 NEW! Only in Theatres</p>
              )}
              {hasStreaming && daysSinceRelease < 7 && (
                <p className="theater-text">🆕 Now Available to Watch at Home</p>
              )}

              {watchProviders?.flatrate && (
                <div className="streaming-list">
                  <h4>Streaming (Subscription):</h4>
                  <div className="provider-logos">
                    {watchProviders.flatrate.map((prov) => (
                      <a
                        key={prov.provider_id}
                        href={providerLinks[prov.provider_name] || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`${LOGO_BASE_URL}${prov.logo_path}`}
                          alt={prov.provider_name}
                          title={prov.provider_name}
                          className="provider-logo"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {(watchProviders?.buy || watchProviders?.rent) && (
                <div className="rent-buy">
                  <h4>Rent or Buy:</h4>
                  {watchProviders.rent && (
                    <div className="provider-logos">
                      {watchProviders.rent.map((p) => (
                        <a
                          key={`rent-${p.provider_id}`}
                          href={providerLinks[p.provider_name] || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`${LOGO_BASE_URL}${p.logo_path}`}
                            alt={p.provider_name}
                            title={`Rent: ${p.provider_name}`}
                            className="provider-logo"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                  {watchProviders.buy && (
                    <div className="provider-logos">
                      {watchProviders.buy.map((p) => (
                        <a
                          key={`buy-${p.provider_id}`}
                          href={providerLinks[p.provider_name] || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`${LOGO_BASE_URL}${p.logo_path}`}
                            alt={p.provider_name}
                            title={`Buy: ${p.provider_name}`}
                            className="provider-logo"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="share-button-container">
  <button
    className="icon-share-button"
    onClick={() => {
      if (navigator.share) {
        navigator.share({
          title: movie.title,
          text: `Check out "${movie.title}"!`,
        url: `${window.location.origin}/movie/${movie.id}/${slugify(movie.title)}`
        });
      } else {
        alert("Sharing not supported on this browser.");
      }
    }}
    aria-label="Share"
  >
    <span className="share-label">SHARE</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="share-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  </button>
</div>

        {trailer && (
          <div className="trailer-wrapper">
            <div className="trailer">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                frameBorder="0"
                allowFullScreen
                title="Trailer"
              ></iframe>
            </div>
          </div>
        )}
      </div>
      


      {recommended.length > 0 && (
        <div className="recommended-section">
          <h2>You Might Also Like</h2>
          <div className="recommended-list">
            {recommended.map((rec) => (
              <Link to={`/movie/${rec.id}/${slugify(rec.title)}`} key={rec.id} className="recommended-card">
                <img
                  src={rec.poster_path ? `${IMAGE_BASE_URL}${rec.poster_path}` : "/nopicture.jpg"}
                  alt={rec.title}
                  className="recommended-poster"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
