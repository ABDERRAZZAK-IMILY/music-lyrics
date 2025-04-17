import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MusicPage from './pages/music'
import SearchPage from './pages/search'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/music" element={<MusicPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
