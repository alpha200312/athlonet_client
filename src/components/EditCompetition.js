import React from 'react';

const EditCompetition = ({ editData, setEditData, handleEditCompetition, loading, setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Edit Competition</h2>

        <div className="space-y-4">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            placeholder="Event Name"
            className="w-full p-3 border rounded"
          />

          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Description"
            className="w-full p-3 border rounded resize-none"
            rows="3"
          />

          <input
            type="text"
            value={editData.sport}
            onChange={(e) => setEditData({ ...editData, sport: e.target.value })}
            placeholder="Sport"
            className="w-full p-3 border rounded"
          />

          <input
            type="datetime-local"
            value={editData.startDate?.slice(0, 16)}
            onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
            className="w-full p-3 border rounded"
          />

          <input
            type="datetime-local"
            value={editData.endDate?.slice(0, 16)}
            onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
            className="w-full p-3 border rounded"
          />

          <input
            type="text"
            value={editData.location}
            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
            placeholder="Location"
            className="w-full p-3 border rounded"
          />

          <select
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            className="w-full p-3 border rounded"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleEditCompetition}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompetition;
