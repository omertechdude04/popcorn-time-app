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

  useEffect(() => {
    // Show loading screen for 3s
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Request permission & get FCM token
    requestForToken(setTokenFound);

    // Listen for incoming messages while app is in foreground
    onMessageListener()
      .then((payload) => {
        console.log("Foreground push notification received:", payload);
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body
        });
      })
      .catch((err) => console.error("Failed to receive message: ", err));
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  useEffect(() => {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Notifications allowed!');
      // Here you'd also get the FCM token and store it
    }
  });
}, []);


  return (
    <Router>
      <>
        {/* Optional in-app notification banner */}
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
