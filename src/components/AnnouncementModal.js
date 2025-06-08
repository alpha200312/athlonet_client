// src/components/AnnouncementModal.js
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/api';

const AnnouncementModal = ({ competition, token, onClose }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/event/announcement/${competition._id}`);
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/event/announcement/${competition._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newAnnouncement })
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
        setNewAnnouncement('');
      } else {
        alert(data.message || 'Failed to add announcement');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">📣 Announcements for: {competition.name}</h2>

        <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
          {announcements.map((a, i) => (
            <div key={i} className="p-3 border rounded bg-gray-50">
              <p className="text-sm text-gray-800">{a.text}</p>
              <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</p>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="text-gray-500">No announcements yet.</p>
          )}
        </div>

        <textarea
          rows="3"
          placeholder="Write new announcement..."
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={handleAddAnnouncement}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Announcement'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
