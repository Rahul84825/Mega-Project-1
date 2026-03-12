// ── Store Location: Mahalaxmi Steels, Akurdi, Pune ────────────────────────────
const STORE_LOCATION = {
  lat: 18.6492,
  lng: 73.7698,
};

const MAX_DELIVERY_RADIUS_KM = 20;

// ── Haversine formula — distance between two lat/lng points in KM ─────────────
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Geocode pincode via Nominatim ─────────────────────────────────────────────
async function geocodePincode(pincode, city = "", state = "") {
  const query = `${pincode} ${city} ${state} India`.trim();
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in`;

  const res = await fetch(url, {
    headers: { "User-Agent": "MahalaxmiSteels-Backend/1.0" },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data.length) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

// ── Check delivery eligibility ────────────────────────────────────────────────
async function checkDeliveryEligibility(pincode, city = "", state = "") {
  const geo = await geocodePincode(pincode, city, state);
  if (!geo) return { eligible: true, distance: null, reason: "geocode_failed" };

  const distance = haversineDistance(
    STORE_LOCATION.lat,
    STORE_LOCATION.lng,
    geo.lat,
    geo.lng
  );
  const rounded = Math.round(distance * 10) / 10;

  return {
    eligible: distance <= MAX_DELIVERY_RADIUS_KM,
    distance: rounded,
    reason: distance > MAX_DELIVERY_RADIUS_KM ? "out_of_range" : "ok",
  };
}

module.exports = {
  STORE_LOCATION,
  MAX_DELIVERY_RADIUS_KM,
  haversineDistance,
  checkDeliveryEligibility,
};
