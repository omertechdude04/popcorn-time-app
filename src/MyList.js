import React, { useEffect, useState } from "react";
import Header from "./Header";
import "./MyList.css";

export default function MyList() {
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("myList")) || [];
    setMyList(storedList);
  }, []);

  const removeFromList = (id) => {
    const updatedList = myList.filter((item) => item.id !== id);
    setMyList(updatedList);
    localStorage.setItem("myList", JSON.stringify(updatedList));
  };

  const isComingSoon = (date) => {
    if (!date) return false;
    const today = new Date();
    const release = new Date(date);
    return release > today;
  };

  const getPosterUrl = (item) => {
    const path = item.poster || item.poster_path;
    return path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : "https://via.placeholder.com/300x450?text=No+Image";
  };

  const getDisplayTitle = (item) => item.title || item.name || "Untitled";

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown date";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month - 1, day);
    const options = { weekday: "long", month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Header />
      <div className="mylist-container">
        <h1>🎬 My List</h1>

        {myList.length === 0 ? (
          <p className="empty-message">Your list is empty. Start adding some movies or shows!</p>
        ) : (
          <div className="list-grid">
            {myList.map((item) => (
              <div className="item-info" key={item.id}>
                <img src={getPosterUrl(item)} alt={getDisplayTitle(item)} className="poster" />

                <h3>{getDisplayTitle(item)}</h3>

                {(item.releaseDate || item.release_date) && (
                  <p className="release-date">
                    <strong>Release Date:</strong> {formatDate(item.releaseDate || item.release_date)}
                    {!isComingSoon(item.releaseDate || item.release_date) ? (
                      <span className="out-now"> (Out Now)</span>
                    ) : (
                      <span className="coming-soon"> (Coming Soon)</span>
                    )}
                  </p>
                )}

                {item.type === "tv" && item.season && item.episode && item.episodeName && (
                  <p className="episode-info">
                    <strong>Next Episode:</strong> S{item.season}E{item.episode} - "{item.episodeName}"
                  </p>
                )}

                <button className="remove-button" onClick={() => removeFromList(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
