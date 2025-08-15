import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import MovieDetail from "./MovieDetail";
import ActorDetail from "./ActorDetail";
import TvShowDetail from "./TVDetails";
import Movies from "./Movies";
import TVShows from "./TVShows";
import LoadingScreen from "./LoadingScreen";
import Search from "./Search";
import "./index.css";
import DirectorInfo from "./DirectorInfo";
import MyList from "./MyList";

// Import Firebase functions
import { requestForToken, onMessageListener } from "./firebase";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [tokenFound, setTokenFound] = useState(false);

  // Loading screen effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Request notification permission + setup Firebase Cloud Messaging
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notifications allowed!");
        // Get FCM token
        requestForToken(setTokenFound);
      } else {
        console.warn("Notifications permission denied");
      }
    });

    // Listen for foreground messages
    onMessageListener()
      .then((payload) => {
        console.log("Foreground push notification received:", payload);
        setNotification({
          title: payload.notification?.title || "",
          body: payload.notification?.body || ""
        });
      })
      .catch((err) => console.error("Failed to receive message: ", err));
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <>
        {/* In-app notification banner */}
        {notification?.title && (
          <div
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              background: "#333",
              color: "#fff",
              padding: "10px 15px",
              borderRadius: "8px",
              zIndex: 1000
            }}
          >
            <strong>{notification.title}</strong>
            <p style={{ margin: 0 }}>{notification.body}</p>
          </div>
        )}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id/:slug" element={<MovieDetail />} />
          <Route path="/tvshow/:id/:slug?" element={<TvShowDetail />} />
          <Route path="/actor/:id" element={<ActorDetail />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tvshows" element={<TVShows />} />
          <Route path="/search" element={<Search />} />
          <Route path="/director/:id" element={<DirectorInfo />} />
          <Route path="/mylist" element={<MyList />} />
        </Routes>
      </>
    </Router>
  );
}
