// src/component/Logout.js
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Logout = () => {
  const { logout } = useAuth(); // Use auth context

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;