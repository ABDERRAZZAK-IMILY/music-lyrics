# Museekly - Lyrics Search Application

Museekly is a web application that allows users to search for song lyrics, view album artwork, and listen to song previews.

## Features

- Search for songs by title or artist
- View song lyrics
- Display album artwork
- Play song previews
- Responsive design

## Technologies Used

- React
- Vite
- Axios
- Express (for proxy server)
- lyrics.ovh API (for lyrics)
- Deezer API (for album artwork and previews)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

Note: This project uses ES modules, not CommonJS.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd museekly
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

The application consists of two parts:
1. A React frontend
2. A proxy server to bypass CORS issues with the Deezer API

### Step 1: Start the Proxy Server

The proxy server is required to bypass CORS restrictions when accessing the Deezer API.

```
node server.js
```

You should see a message: `Proxy server running at http://localhost:3001`

### Step 2: Start the Frontend Application

In a new terminal window:

```
npm run dev
```

This will start the Vite development server, and you should see a message with the local URL (typically http://localhost:5173).

## How to Use

1. Open your browser and navigate to http://localhost:5173
2. Enter a song title or artist name in the search box
3. Click "Search" to find songs
4. Click "View Lyrics" to see the lyrics for a specific song
5. Click "Play Preview" to listen to a preview of the song

## Troubleshooting

### Album Images or Music Previews Not Loading

- Make sure the proxy server is running at http://localhost:3001
- Check the browser console for any error messages
- Verify that your internet connection is working

### Lyrics Not Found

- Try searching for a different song
- Check if the artist name and song title are spelled correctly
- Some songs may not have lyrics available in the database

## License

[MIT License](LICENSE)

## Acknowledgements

- [lyrics.ovh](https://lyrics.ovh) for providing the lyrics API
- [Deezer](https://developers.deezer.com) for providing album artwork and music previews
- [react-h5-audio-player](https://www.npmjs.com/package/react-h5-audio-player) for the audio player component