import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/http";

export default function ListingPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) {
        setErr("Missing listing id in URL.");
        return;
      }

      try {
        setErr("");
        setItem(null);

        // ✅ IMPORTANT: match your API versioning
        const res = await api.get(`http://localhost:8080/v1/listing/${encodeURIComponent(id)}`);
        console.log('id', id);
        if (!cancelled) setItem(res.data);
      } catch (e) {
        console.error("Listing fetch failed:", e);
        if (!cancelled) {
          setErr(
            e?.response?.data?.message ||
              e?.response?.statusText ||
              e?.message ||
              "Failed to load listing."
          );
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const reserve = async () => {
    try {
      const { data } = await api.post("/v1/reservations", { listingId: id, quantity: 1 });
      alert("Held! Expires at: " + new Date(data.expiresAt).toLocaleTimeString());
    } catch (e) {
      console.error("Reserve failed:", e);
      alert(e?.response?.data?.message || "Could not hold this item.");
    }
  };

  if (err) return <div className="container">Error: {err}</div>;
  if (!item) return <div className="container">Loading…</div>;

  return (
    <div className="container">
      <h2>{item.title}</h2>
      <div className="badge">{item.condition}</div>
      <div style={{ margin: "12px 0" }}>Rescue price: ${item.rescuePrice ?? item.price ?? 0}</div>
      <div>{item.gradeNotes}</div>
      <button className="button" onClick={reserve}>
        Hold for 15 min
      </button>
    </div>
  );
}
