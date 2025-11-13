// src/components/DashboardPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let user = { name: 'User', email: '', role: '' };
  if (token) {
    try {
      const decoded = jwtDecode(token);
      user = {
        name: decoded.nama || 'User',   // ✅ sesuaikan dengan payload JWT backend
        email: decoded.email || '',     // (opsional: email hanya muncul jika ada di token)
        role: decoded.role || 'user',
      };
    } catch (e) {
      console.warn('Token tidak valid');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-lg">
        <div className="bg-indigo-600 py-6 px-6 text-white text-center">
          <h1 className="text-2xl font-bold">🎉 Selamat Datang!</h1>
          <p className="text-indigo-100 mt-1">Anda berhasil login</p>
        </div>

        <div className="p-8 text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-indigo-600">👤</span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          {user.email && <p className="text-gray-600 mt-1">{user.email}</p>}
          <p className="text-sm bg-gray-100 text-gray-700 inline-block px-3 py-1 rounded-full mt-2">
            Peran: {user.role === 'mahasiswa' ? 'Mahasiswa' : 'Admin'}
          </p>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="py-2.5 px-6 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition duration-200"
            >
              🔙 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;