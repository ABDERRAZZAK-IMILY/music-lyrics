import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/deezer/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const response = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=1`);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to Deezer:', error);
    res.status(500).json({ error: 'Failed to fetch data from Deezer' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});