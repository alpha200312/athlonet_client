import React from 'react';

const NotVerifiedPage = ({ handleLogout }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-6 text-center">
    <h1 className="text-3xl font-bold text-yellow-700 mb-4">⛔ Not Verified</h1>
    <p className="text-gray-700 mb-6 max-w-md">
      Your organization is not yet verified by the admin. Once verified, you'll gain access to dashboard features.
    </p>
    <button
      onClick={handleLogout}
      className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
    >
      Logout
    </button>
  </div>
);

export default NotVerifiedPage;
