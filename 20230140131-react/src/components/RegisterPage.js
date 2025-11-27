// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ nama: '', email: '', password: '', role: 'mahasiswa' });
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3009/api/auth/register', form);
      nav('/login');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {msg && <p className="text-red-600 mb-2">{msg}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nama" placeholder="Nama Lengkap" required
            className="w-full px-3 py-2 border rounded" onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" required
            className="w-full px-3 py-2 border rounded" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" required
            className="w-full px-3 py-2 border rounded" onChange={handleChange} />
          <select name="role" className="w-full px-3 py-2 border rounded" onChange={handleChange}>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="admin">Admin</option>
          </select>
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}