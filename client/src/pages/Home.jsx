import React from 'react';
import { useAuth } from "../firebase/authContext";

function Home() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {currentUser?.displayName || currentUser?.email}!
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
        
        
        <div className="bg-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl text-white mb-4">VOXCRIBE Dashboard</h2>
          <p className="text-slate-300">Your transcription workspace</p>
        </div>
      </div>
    </div>
  );
}

export default Home;