import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../App.css';

function MusicPage() {
  const [lyrics, setLyrics] = useState('');
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const artist = searchParams.get('artist');
  const title = searchParams.get('title');
  
  useEffect(() => {
    const fetchData = async () => {
      if (!artist || !title) {
        setError('Missing artist or song information');
        setLoading(false);
        return;
      }
      
      try {
        // Fetch lyrics from lyrics.ovh
        const lyricsPromise = axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
        
        // Fetch lyrics first
        const lyricsResponse = await lyricsPromise;
        setLyrics(lyricsResponse.data.lyrics || 'No lyrics available');
        
        // Try to get song data from Deezer, but don't let it block the lyrics display
        try {
          const songDataResponse = await axios.get(
            `http://localhost:3001/api/deezer/search?q=${encodeURIComponent(artist + ' ' + title)}`
          );
          
          if (songDataResponse.data.data && songDataResponse.data.data.length > 0) {
            setSongData(songDataResponse.data.data[0]);
          }
        } catch (deezerErr) {
          console.warn('Could not fetch additional song data from Deezer:', deezerErr);
          // Continue without Deezer data - lyrics will still be displayed
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Lyrics not found for this song');
        } else {
          setError('Error fetching data. Please try again.');
        }
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [artist, title]);
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  return (
    <div className="lyrics-container">
      <button onClick={handleGoBack} className="back-button">
        &larr; Back to Search
      </button>
      
      <div className="song-details">
        <div className="album-image">
          {songData && songData.album ? (
            <img 
              src={songData.album.cover_medium || songData.album.cover || `https://via.placeholder.com/200x200?text=${encodeURIComponent(songData.album.title)}`} 
              alt={`${songData.album.title} cover`}
              className="album-cover-large"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/200x200?text=${encodeURIComponent(songData.album.title)}`;
              }}
            />
          ) : (
            <img 
              src={`https://via.placeholder.com/200x200?text=${encodeURIComponent(title || 'Album')}`} 
              alt="Album cover"
              className="album-cover-large"
            />
          )}
        </div>
        
        <div className="song-header">
          <h1>{title}</h1>
          <h2>by {artist}</h2>
          {songData && songData.album && (
            <p className="album-name">Album: {songData.album.title}</p>
          )}
        </div>
      </div>
      
      {songData && songData.preview && (
        <div className="audio-player-container">
          <h3>Preview</h3>
          <AudioPlayer
            src={songData.preview}
            autoPlay={false}
            showJumpControls={false}
            layout="stacked-reverse"
            customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
          />
        </div>
      )}
      
      <div className="lyrics-content">
        {loading ? (
          <div className="loading">Loading lyrics...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="lyrics">
            {lyrics.split('\n').map((line, index) => (
              <p key={index}>{line || <br />}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicPage;