import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./MovieDetail.css";
import Header from './Header';
import LoadingScreen from "./LoadingScreen"; 


const API_KEY = "ecf26f78d899754853efc76e880258b3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const LOGO_BASE_URL = "https://image.tmdb.org/t/p/original";

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

export default function TvShowDetail() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    async function fetchDetails() {
      try {
        const [showRes, creditsRes, videoRes, watchRes, recRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${API_KEY}`),
        ]);

        const showData = await showRes.json();
        const creditsData = await creditsRes.json();
        const videoData = await videoRes.json();
        const watchData = await watchRes.json();
        const recData = await recRes.json();

        setShow(showData);
        setCredits(creditsData);
        const trailerVideo = videoData.results.find((v) => v.type === "Trailer");
        setTrailer(trailerVideo);
        setWatchProviders(watchData.results.US);
        setRecommended(recData.results || []);
      } catch (error) {
        console.error("Failed to fetch TV show details:", error);
      }
    }

    fetchDetails();
  }, [id]);

  if (!show || !credits) return <LoadingScreen />;

  const creator = show.created_by?.[0];
  const genres = show.genres?.map((g) => g.name).join(", ") || "N/A";

  const castLinks = credits.cast.slice(0, 8).map((c) => (
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
  ));

  return (
    <>
    <Header />

      <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>

      <div className="movie-detail">
        <div className="detail-main">
          <img
            src={show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : ""}
            alt={show.name || "Show Poster"}
            className="movie-poster"
          />
          <div className="detail-info">
            <h1>{show.name} ({show.first_air_date?.slice(0, 4) || "N/A"})</h1>
            <p className="genres">{genres}</p>
            <p><strong>Seasons:</strong> {show.number_of_seasons || "N/A"}</p>
            <p><strong>Episodes:</strong> {show.number_of_episodes || "N/A"}</p>
            <p><strong>Creator:</strong> {creator?.name || "Unknown"}</p>
            <p><strong>Cast:</strong></p>
            <div className="cast-image-container">{castLinks}</div>

            <div className="rating-section">
              <img src="/imdblogo.png" alt="IMDb Logo" className="imdb-logo" />
              <span className="imdb-score">
                {show.vote_average ? show.vote_average.toFixed(1) : "N/A"}/10
              </span>
            </div>

            <p><strong>What's It About?</strong> {show.overview || "No description available."}</p>

            {watchProviders && (
              <div className="where-to-watch">
                <p>Where to Watch</p>

                {watchProviders.flatrate && (
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
              </div>
            )}
          </div>
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
            {recommended.slice(0, 10).map((rec) => (
              <Link
                to={`/tvshow/${rec.id}-${rec.name.replace(/\s+/g, '-').toLowerCase()}`}
                key={rec.id}
                className="recommended-card"
              >
                <img
                  src={rec.poster_path ? `${IMAGE_BASE_URL}${rec.poster_path}` : "/nopicture.jpg"}
                  alt={rec.name}
                  className="recommended-poster"
                />
                <p>{rec.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
