import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;
const DEEZER_API_URL = process.env.DEEZER_API_URL || 'https://api.deezer.com';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.get('/api/deezer/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const response = await axios.get(`${DEEZER_API_URL}/search?q=${encodeURIComponent(q)}&limit=1`);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to Deezer:', error);
    res.status(500).json({ error: 'Failed to fetch data from Deezer' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});