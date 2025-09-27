import React from 'react'

export default function Filters({ value, onChange, onApply }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <div className="toolbar">
      <input className="input" placeholder="Search brand/model…" value={value.q} onChange={e=>set('q', e.target.value)} />
      <input className="input" placeholder="ZIP (optional)" value={value.zip} onChange={e=>set('zip', e.target.value)} />
      <select className="select" value={value.category} onChange={e=>set('category', e.target.value)}>
        <option value="">All categories</option>
        <option value="LAPTOP">Laptop</option>
        <option value="DESKTOP">Desktop</option>
        <option value="MONITOR">Monitor</option>
        <option value="PHONE">Phone</option>
        <option value="TABLET">Tablet</option>
        <option value="ACCESSORY">Accessory</option>
        <option value="COMPONENT">Component</option>
        <option value="SERVER">Server</option>
        <option value="NETWORKING">Networking</option>
        <option value="OTHER">Other</option>
      </select>
      <input className="input" placeholder="Min $" value={value.minPrice} onChange={e=>set('minPrice', e.target.value)} />
      <input className="input" placeholder="Max $" value={value.maxPrice} onChange={e=>set('maxPrice', e.target.value)} />
      <button className="button" onClick={onApply}>Apply</button>
    </div>
  )
}
