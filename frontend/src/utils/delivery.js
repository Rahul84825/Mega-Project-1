// ── Store Location: Mahalaxmi Steels, Akurdi, Pune ────────────────────────────
export const STORE_LOCATION = {
  lat: 18.6492,
  lng: 73.7698,
  address: "Ekta Nagar, Akurdi Gaothan, Dattawadi, Akurdi, Pune 411035",
};

export const MAX_DELIVERY_RADIUS_KM = 20;

// ── Haversine formula — distance between two lat/lng points in KM ─────────────
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Check if given coordinates are within delivery radius ─────────────────────
export function isWithinDeliveryRadius(lat, lng) {
  const distance = haversineDistance(
    STORE_LOCATION.lat,
    STORE_LOCATION.lng,
    lat,
    lng
  );
  return { distance: Math.round(distance * 10) / 10, withinRadius: distance <= MAX_DELIVERY_RADIUS_KM };
}

// ── Geocode a pincode using Nominatim (free, no API key) ──────────────────────
export async function geocodePincode(pincode, city = "", state = "") {
  const query = `${pincode} ${city} ${state} India`.trim();
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in`;

  const res = await fetch(url, {
    headers: { "User-Agent": "MahalaxmiSteels/1.0" },
  });

  if (!res.ok) throw new Error("Geocoding service unavailable");

  const data = await res.json();
  if (!data.length) throw new Error("Could not locate this pincode/address");

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}

// ── Full check: pincode → geocode → distance ─────────────────────────────────
export async function checkDeliveryEligibility(pincode, city = "", state = "") {
  const geo = await geocodePincode(pincode, city, state);
  const result = isWithinDeliveryRadius(geo.lat, geo.lng);
  return { ...result, lat: geo.lat, lng: geo.lng };
}
