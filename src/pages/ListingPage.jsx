import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/http'

export default function ListingPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)

  useEffect(() => {
    api.get('/listings/' + id).then(({data}) => setItem(data))
  }, [id])

  const reserve = async () => {
    const { data } = await api.post('/reservations', { listingId: id, quantity: 1 })
    alert('Held! Expires at: ' + new Date(data.expiresAt).toLocaleTimeString())
  }

  if (!item) return <div className="container">Loading…</div>
  return (
    <div className="container">
      <h2>{item.title}</h2>
      <div className="badge">{item.condition}</div>
      <div style={{margin:'12px 0'}}>Rescue price: ${item.rescuePrice}</div>
      <div>{item.gradeNotes}</div>
      <button className="button" onClick={reserve}>Hold for 15 min</button>
    </div>
  )
}
