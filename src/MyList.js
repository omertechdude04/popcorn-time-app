import React, { useEffect, useState } from "react";
import Header from './Header';
import "./MyList.css";

export default function MyList() {
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("myList")) || [];
    setMyList(storedList);
  }, []);

  const removeFromList = (id) => {
    const updatedList = myList.filter(item => item.id !== id);
    setMyList(updatedList);
    localStorage.setItem("myList", JSON.stringify(updatedList));
  };

  const isComingSoon = (releaseDate) => {
    if (!releaseDate) return false;
    const today = new Date();
    const release = new Date(releaseDate);
    return release > today;
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
            {myList.map(item => (
              <div className="list-item" key={item.id}>
                <img src={item.poster} alt={item.title} className="item-poster" />
                <div className="item-info">
                {isComingSoon(item.releaseDate) && (
                  <p className="release-date">
                    Release: {new Date(item.releaseDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })} <span className="coming-soon">(Coming Soon)</span>
                  </p>
          )}

                  <button onClick={() => removeFromList(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
