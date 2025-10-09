// server.js
const express = require('express');
const app = express();
const PORT = 5000;


const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: "Hello from Server!"
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});