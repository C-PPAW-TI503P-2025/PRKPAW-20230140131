// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ named import

export default function Navbar() {
  const nav = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null; // ✅ jwtDecode (bukan jwt_decode)

  const logout = () => {
    localStorage.removeItem('token');
    nav('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">PresensiApp</div>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/presensi" className="hover:underline">Presensi</Link>
            {user?.role === 'admin' && (
              <Link to="/reports" className="hover:underline">Laporan Admin</Link>
            )}
            <span className="ml-4">Halo, {user.nama}</span>
            <button onClick={logout} className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}