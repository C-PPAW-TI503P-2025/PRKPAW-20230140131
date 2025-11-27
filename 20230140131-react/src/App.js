// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/navbar'; // pastikan nama file-nya kecil semua
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportPage';

// 1. Cek token (bisa diganti context / redux kalau mau)
const isAuthenticated = () => !!localStorage.getItem('token');

// 2. Bungkus halaman yang butuh login
const Protected = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" replace />;

// 3. Redirect otomatis ke dashboard kalau sudah login
const PublicOnly = ({ children }) =>
  !isAuthenticated() ? children : <Navigate to="/dashboard" replace />;

function App() {
  return (
    <Router>
      {/* Navbar selalu tampil */}
      <Navbar />

      {/* Konten utama */}
      <main className="flex-grow">
        <Routes>
          {/* Halaman publik (hanya boleh diakses kalau belum login) */}
          <Route
            path="/login"
            element={
              <PublicOnly>
                <LoginPage />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <RegisterPage />
              </PublicOnly>
            }
          />

          {/* Halaman yang butuh login */}
          <Route
            path="/dashboard"
            element={
              <Protected>
                <DashboardPage />
              </Protected>
            }
          />
          <Route
            path="/presensi"
            element={
              <Protected>
                <PresensiPage />
              </Protected>
            }
          />

          {/* Halaman admin (bisa ditambah pengecekan role di sini) */}
          <Route
            path="/reports"
            element={
              <Protected>
                <ReportPage />
              </Protected>
            }
          />

          {/* Root: arahkan ke dashboard kalau sudah login */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />}
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;