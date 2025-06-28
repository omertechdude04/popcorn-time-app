import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import MovieDetail from "./MovieDetail";
import ActorDetail from "./ActorDetail";
import TvShowDetail from "./TVDetails";
import Movies from "./Movies";
import TVShows from "./TVShows"; // ✅ NEW
import LoadingScreen from "./LoadingScreen";
import Search from "./Search";
import "./index.css";
import DirectorInfo from "./DirectorInfo";


export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
<Router>
  <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movie/:id/:slug" element={<MovieDetail />} />
      <Route path="/tvshow/:id/:slug?" element={<TvShowDetail />} />
      <Route path="/actor/:id" element={<ActorDetail />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/tvshows" element={<TVShows />} />
      <Route path="/search" element={<Search />} />
      <Route path="/director/:id" element={<DirectorInfo />} />
    </Routes>
  </>
</Router>
  );
}
