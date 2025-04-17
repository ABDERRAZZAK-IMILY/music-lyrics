import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../App.css';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPreview, setCurrentPreview] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to perform the search using lyrics.ovh and enrich with Deezer
  const performSearch = async (term) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First, search using lyrics.ovh
      const response = await axios.get(`https://api.lyrics.ovh/suggest/${encodeURIComponent(term)}`);
      const initialResults = response.data.data || [];
      
      // Enrich results with Deezer data if available
      const enrichedResults = await Promise.all(
        initialResults.map(async (song) => {
          try {
            // Try to get additional data from Deezer via our proxy server
            const deezerResponse = await axios.get(
              `http://localhost:3001/api/deezer/search?q=${encodeURIComponent(song.artist.name + ' ' + song.title)}`
            );
            
            if (deezerResponse.data.data && deezerResponse.data.data.length > 0) {
              const deezerData = deezerResponse.data.data[0];
              return {
                ...song,
                album: {
                  ...song.album,
                  cover: deezerData.album.cover,
                  cover_medium: deezerData.album.cover_medium
                },
                preview: deezerData.preview
              };
            }
            return song;
          } catch (err) {
            console.warn('Could not enrich song with Deezer data:', err);
            return song;
          }
        })
      );
      
      setSearchResults(enrichedResults);
    } catch (err) {
      setError('Error searching for songs. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to play/pause preview
  const handlePlayPreview = (previewUrl) => {
    setCurrentPreview(previewUrl);
  };

  // Check for search term in URL when component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const termFromUrl = searchParams.get('search');
    
    if (termFromUrl) {
      setSearchTerm(termFromUrl);
      performSearch(termFromUrl);
    }
  }, [location.search]);

  // Handle form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Update URL with search term
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    
    // Perform the search
    performSearch(searchTerm);
  };

  const handleViewLyrics = (artist, title) => {
    navigate(`/music?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);
  };

  return (
    <div className="search-container">
      <h1>Museekly - Lyrics Search</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for songs or artists..."
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {currentPreview && (
        <div className="audio-player-container">
          <AudioPlayer
            src={currentPreview}
            autoPlay
            showJumpControls={false}
            layout="stacked-reverse"
            customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
            autoPlayAfterSrcChange={true}
            onClickPrevious={() => setCurrentPreview(null)}
            onClickNext={() => setCurrentPreview(null)}
          />
        </div>
      )}
      
      <div className="results-container">
        {searchResults.length > 0 ? (
          <div className="results-list">
            <h2>Search Results</h2>
            {searchResults.map((song, index) => (
              <div key={index} className="song-item">
                <div className="song-image">
                  <img 
                    src={song.album.cover_medium || song.album.cover || `https://via.placeholder.com/100x100?text=${encodeURIComponent(song.album.title)}`} 
                    alt={`${song.album.title} cover`}
                    className="album-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/100x100?text=${encodeURIComponent(song.album.title)}`;
                    }}
                  />
                </div>
                <div className="song-info">
                  <h3>{song.title}</h3>
                  <p>Artist: {song.artist.name}</p>
                  <p>Album: {song.album.title}</p>
                  <div className="song-buttons">
                    <button 
                      onClick={() => handleViewLyrics(song.artist.name, song.title)}
                      className="lyrics-button"
                    >
                      View Lyrics
                    </button>
                    {song.preview && (
                      <button 
                        onClick={() => handlePlayPreview(song.preview)}
                        className="preview-button"
                      >
                        {currentPreview === song.preview ? 'Playing...' : 'Play Preview'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && searchTerm && <p className="no-results">No results found. Try a different search term.</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;