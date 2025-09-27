import React from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/http'

export default function ListingCard({ item }) {
  const reserve = async () => {
    const { data } = await api.post('/reservations', { listingId: item._id, quantity: 1 })
    alert('Held! Expires at: ' + new Date(data.expiresAt).toLocaleTimeString())
  }
  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Link to={`/listing/${item._id}`} style={{color:'#e6eef7', textDecoration:'none'}}><strong>{item.title}</strong></Link>
        <span className="badge">{item.condition}</span>
      </div>
      <div style={{opacity:.8, fontSize:13, margin:'6px 0'}}>{item.brand} {item.model}</div>
      <div style={{margin:'6px 0'}}><strong>${item.rescuePrice}</strong> <span style={{opacity:.7}}>rescue price</span></div>
      {item.distanceKm != null && <div style={{opacity:.7, fontSize:12}}>{item.distanceKm} km away</div>}
      <button className="button" onClick={reserve} style={{marginTop:8}}>Hold 15 min</button>
    </div>
  )
}
