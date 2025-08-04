import React, { useEffect, useState } from 'react';
import './ReminderPopup.css';

export default function ReminderPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [soonReleasingItems, setSoonReleasingItems] = useState([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('myList')) || [];

    const upcoming = list
      .filter(item => item.releaseDate)
      .map(item => {
        const daysLeft = Math.ceil(
          (new Date(item.releaseDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return { ...item, daysLeft };
      })
      .filter(item => item.daysLeft >= 0 && item.daysLeft <= 10);

    if (upcoming.length > 0) {
      setSoonReleasingItems(upcoming);
      setShowPopup(true);
    }
  }, []);

  if (!showPopup || soonReleasingItems.length === 0) return null;

  return (
    <div className="reminder-popup">
      <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>
      <h4>🎬 Coming Up</h4>
      <ul>
        {soonReleasingItems.map((item) => (
          <li key={item.id}>
            <strong>{item.title || item.name}</strong> comes out in {item.daysLeft} day{item.daysLeft !== 1 ? 's' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
