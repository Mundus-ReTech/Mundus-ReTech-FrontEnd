import React from 'react'
import Home from './pages/Home.jsx'
import ListingPage from './pages/ListingPage.jsx'
import { Routes, Route, Link } from 'react-router-dom'

export default function App() {
  return (
    <div>
      <div className="header container">
        <Link to="/" style={{textDecoration:'none', color:'#e6eef7'}}><h2>Retech</h2></Link>
        <div>TooGoodToGo for tech.</div>
      </div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/listing/:id" element={<ListingPage/>} />
      </Routes>
    </div>
  )
}
