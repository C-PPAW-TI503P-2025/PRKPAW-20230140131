// src/components/ReportPage.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getToken = () => localStorage.getItem('token');

export default function ReportPage() {
  const nav = useNavigate();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchReports = useCallback(async (q = '') => {
    try {
      const res = await axios.get(
        `http://localhost:3009/api/reports/daily${q ? '?nama=' + encodeURIComponent(q) : ''}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      // ✅ Ambil array dari res.data.data
      setReports(res.data.data || []);
      setError('');
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal memuat laporan');
      if (e.response?.status === 403) nav('/login');
    }
  }, [nav]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleSearch = e => {
    e.preventDefault();
    fetchReports(search);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Presensi Harian</h1>

      <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama..."
          className="flex-grow px-3 py-2 border rounded"
        />
        <button className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
          Cari
        </button>
      </form>

      {error && <p className="text-red-600 bg-red-100 p-4 rounded mb-4">{error}</p>}

      <div className="bg-white shadow-md rounded overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-Out</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length ? (
              reports.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.nama || 'N/A'} {/* ✅ Gunakan p.nama, bukan p.user.nama */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.checkIn ? new Date(p.checkIn).toLocaleString('id-ID') : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.checkOut
                      ? new Date(p.checkOut).toLocaleString('id-ID')
                      : 'Belum Check-Out'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}