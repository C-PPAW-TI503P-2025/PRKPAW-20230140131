// routes/books.js
const express = require('express');
const router = express.Router();

let books = [
  { id: 1, title: 'Belajar Node.js', author: 'Asroni' },
  { id: 2, title: 'Pengembangan Web Modern', author: 'Budi Santoso' }
];

// GET semua buku
router.get('/', (req, res) => {
  res.json(books);
});

// GET buku by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ message: 'Buku tidak ditemukan' });
  res.json(book);
});

// POST tambah buku
router.post('/', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title dan author wajib diisi' });
  }
  const newBook = {
    id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
    title: title.trim(),
    author: author.trim()
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT update buku
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title dan author wajib diisi' });
  }
  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Buku tidak ditemukan' });
  }
  books[index] = { id, title: title.trim(), author: author.trim() };
  res.json(books[index]);
});

// DELETE hapus buku
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Buku tidak ditemukan' });
  }
  const deleted = books.splice(index, 1);
  res.json(deleted[0]);
});

// 👇 WAJIB ADA!
module.exports = router;