import React, { useEffect, useState } from 'react';
import './ReminderPopup.css';

export default function ReminderPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [soonItems, setSoonItems] = useState([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('myList')) || [];

    const upcoming = list
      .map(item => {
        const title = item.title || item.name || "Untitled";
        let isEpisode = false;
        let episodeName = '';
        let releaseDate = null;

        // Detect upcoming episode (TV show)
        if (
          item.next_episode_to_air &&
          item.next_episode_to_air.air_date
        ) {
          isEpisode = true;
          episodeName = item.next_episode_to_air.name || '';
          releaseDate = new Date(item.next_episode_to_air.air_date + 'T00:00:00');
        }

        // If not episode, check for movie
        else if (item.releaseDate || item.release_date) {
          releaseDate = new Date((item.releaseDate || item.release_date) + 'T00:00:00');
        }

        if (!releaseDate) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timeDiff = releaseDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft >= 0 && daysLeft <= 7) {
          return {
            id: item.id,
            title,
            isEpisode,
            episodeName,
            releaseDate
          };
        }

        return null;
      })
      .filter(item => item !== null);

    if (upcoming.length > 0) {
      setSoonItems(upcoming);
      setShowPopup(true);
    }
  }, []);

  if (!showPopup || soonItems.length === 0) return null;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="reminder-popup">
      <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>
      <h4>🎬 Coming Up</h4>
      <ul>
        {soonItems.map((item) => (
          <li key={item.id}>
            {item.isEpisode ? (
              <>New Episode of <strong>{item.title}</strong> on {formatDate(item.releaseDate)}</>
            ) : (
              <>New Episode of <strong>{item.title}</strong> comes out on {formatDate(item.releaseDate)}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
