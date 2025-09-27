import React, { useEffect, useState } from 'react'
import api from '../lib/http'
import ListingCard from '../components/ListingCard.jsx'
import Filters from '../components/Filters.jsx'

export default function Home() {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ q:'', zip:'', category:'', minPrice:'', maxPrice:'' })

  const fetchListings = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/listings', { params: { ...filters, page: 1, limit: 24 } })
      setItems(data.items)
      setCount(data.count)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchListings() }, [])

  return (
    <div className="container">
      <Filters value={filters} onChange={setFilters} onApply={fetchListings} />
      <div style={{marginBottom:8}}>{count} results</div>
      {loading ? <div>Loading…</div> : (
        <div className="grid">
          {items.map(it => <ListingCard key={it._id} item={it} />)}
        </div>
      )}
    </div>
  )
}
