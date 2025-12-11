import { apiClient } from "../../lib/ApiClient";
import { useQuery } from "@tanstack/react-query";
// Accepts a params object:
// {
//   page, limit, q, category, zip, minPrice, maxPrice,
//   techTypes, deviceTypes, brands, makes, models, condition
// }
export async function GetListings() {
  try {
    const response = await apiClient.get("http://localhost:8080/v1/all", {

    });
    return response.data;
  } catch (err) {
    console.error("Error fetching listings:", err);
    throw err;
  }
}

export async function CreateListing(data) {
  try {
    const response = await apiClient.post("/v1/createlisting", data);
    return response.data;
  } catch (err) {
    console.error("Error creating listing:", err);
    throw err;
  }
}

export async function UpdateListing(data) {
  try {
    const response = await apiClient.post("/v1/updatelisting", data);
    return response.data;
  } catch (err) {
    console.error("Error updating listing:", err);
    throw err;
  }
}
export const fetchListings = async () => {
  // adjust URL if your backend route is different
  const res = await apiClient.get("http://localhost:8080/v1/all");

  const raw = res.data;

  // Normalize to a plain array
  if (Array.isArray(raw)) {
    return raw;
  }

  if (raw && Array.isArray(raw.items)) {
    return raw.items;
  }

  if (raw && Array.isArray(raw.data)) {
    return raw.data;
  }

  // Fallback
  return [];
};

export function useListingsQuery() {
  return useQuery({
    queryKey: ["Listings"],
    queryFn: fetchListings,
    keepPreviousData: true,
  });
}