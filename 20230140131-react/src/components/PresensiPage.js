import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Ikon sederhana (jika tidak pakai Heroicons)
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState({ checkIn: false, checkOut: false });

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:3009/api",
    headers: { Authorization: `Bearer ${token}` }
  });

  const getLocation = () => {
    setError("");
    setMessage("");
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser ini.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => setError(`Gagal mendapatkan lokasi: ${err.message}`),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const fetchReport = useCallback(async () => {
    try {
      const res = await api.get("/presensi/report");
      setReport(res.data.data || []);
    } catch (err) {
      console.error("Gagal fetch report:", err);
    }
  }, [api]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleCheckIn = async () => {
    if (!coords) {
      setError("Lokasi belum ditemukan. Klik 'Refresh Lokasi' terlebih dahulu.");
      return;
    }
    setLoading({ ...loading, checkIn: true });
    setError("");
    setMessage("");
    try {
      const res = await api.post("/presensi/check-in", {
        latitude: coords.lat,
        longitude: coords.lng,
      });
      setMessage(res.data.message || "Check-in berhasil!");
      fetchReport();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal melakukan Check-in.");
    } finally {
      setLoading({ ...loading, checkIn: false });
    }
  };

  const handleCheckOut = async () => {
    if (!coords) {
      setError("Lokasi belum ditemukan. Klik 'Refresh Lokasi' terlebih dahulu.");
      return;
    }
    setLoading({ ...loading, checkOut: true });
    setError("");
    setMessage("");
    try {
      const res = await api.post("/presensi/check-out", {
        latitude: coords.lat,
        longitude: coords.lng,
      });
      setMessage(res.data.message || "Check-out berhasil!");
      fetchReport();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal melakukan Check-out.");
    } finally {
      setLoading({ ...loading, checkOut: false });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">📍 Presensi Geolocation</h1>
      <p className="text-gray-600 mb-6">Lakukan presensi berdasarkan lokasi Anda saat ini.</p>

      {/* Pesan Status */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded">
          {message}
        </div>
      )}

      {/* Aksi */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={getLocation}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          <LocationIcon />
          Refresh Lokasi
        </button>
        <button
          onClick={handleCheckIn}
          disabled={loading.checkIn}
          className={`flex items-center gap-2 px-4 py-2 rounded transition ${
            loading.checkIn
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading.checkIn ? "Loading..." : "✅ Check In"}
        </button>
        <button
          onClick={handleCheckOut}
          disabled={loading.checkOut}
          className={`flex items-center gap-2 px-4 py-2 rounded transition ${
            loading.checkOut
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {loading.checkOut ? "Loading..." : "❌ Check Out"}
        </button>
      </div>

      {/* Peta & Koordinat */}
      {coords && (
        <div className="border rounded-lg p-4 mb-8 bg-white shadow-sm">
          <div className="h-80 w-full rounded overflow-hidden mb-3">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={16}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Anda saat ini</Popup>
              </Marker>
            </MapContainer>
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Koordinat:</span>{" "}
            <span className="font-mono">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</span>
          </p>
        </div>
      )}

      {/* Tabel Laporan */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">📋 Report Presensi Semua User</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.length > 0 ? (
                report.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{r.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.user?.name || `User ${r.userId}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {r.checkIn ? new Date(r.checkIn).toLocaleString("id-ID") : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {r.checkOut ? new Date(r.checkOut).toLocaleString("id-ID") : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{r.latitude || "-"}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{r.longitude || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Belum ada data presensi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;