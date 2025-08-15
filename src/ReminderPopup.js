import React, { useEffect, useState } from 'react';
import './ReminderPopup.css';

export default function ReminderPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [soonItems, setSoonItems] = useState([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('myList')) || [];
    const fcmToken = localStorage.getItem('fcmToken'); // token saved in App.js

    const upcoming = list
      .map(item => {
        const title = item.title || item.name || "Untitled";
        let isEpisode = false;
        let episodeName = '';
        let releaseDate = null;

        if (item.next_episode_to_air && item.next_episode_to_air.air_date) {
          isEpisode = true;
          episodeName = item.next_episode_to_air.name || '';
          releaseDate = new Date(item.next_episode_to_air.air_date + 'T00:00:00');
        } else if (item.releaseDate || item.release_date) {
          releaseDate = new Date((item.releaseDate || item.release_date) + 'T00:00:00');
        }

        if (!releaseDate) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysLeft = Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));

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
      .filter(Boolean);

    if (upcoming.length > 0) {
      setSoonItems(upcoming);
      setShowPopup(true);

      // 🚀 Send push if token exists
      if (fcmToken) {
        upcoming.forEach(item => {
          fetch("/.netlify/functions/sendNotification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: fcmToken,
              title: item.isEpisode
                ? `New Episode of ${item.title}`
                : `${item.title} releases soon!`,
              body: `Coming on ${item.releaseDate.toDateString()}`
            })
          })
          .then(res => res.json())
          .then(data => console.log("Push sent:", data))
          .catch(err => console.error("Push error:", err));
        });
      }
    }
  }, []);

  if (!showPopup || soonItems.length === 0) return null;

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  return (
    <div className="reminder-popup">
      <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>
      <h4>🎬 Coming Up</h4>
      <ul>
        {soonItems.map((item) => (
          <li key={item.id}>
            {item.isEpisode
              ? <>New Episode of <strong>{item.title}</strong> on {formatDate(item.releaseDate)}</>
              : <><strong>{item.title}</strong> comes out on {formatDate(item.releaseDate)}</>}
          </li>
        ))}
      </ul>
    </div>
  );
}
